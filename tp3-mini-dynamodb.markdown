---
layout: page
title: TP3 - Mini-DynamoDB
permalink: /trabajos-practicos/tp3-mini-dynamodb/
---

## **1\. Introducción**

En este trabajo práctico los estudiantes deberán implementar una versión reducida del servicio **Amazon DynamoDB**, uno de los sistemas de almacenamiento distribuido más utilizados en la industria actual. El objetivo es construir un prototipo funcional que combine los principales componentes que caracterizan a los sistemas modernos de datos distribuidos: **replicación mediante consenso (Raft)**, **particionado de datos (sharding)**, **coordinación distribuida (etcd)** y **consistencia configurable**.

El servicio resultante, denominado **Mini-DynamoDB**, será un **almacenamiento [clave-valor](https://es.wikipedia.org/wiki/Base_de_datos_clave-valor) distribuido**, accesible a través de una API gRPC, que permitirá realizar operaciones básicas de lectura, escritura y borrado (`Get`, `Put`, `Delete`) sobre múltiples tablas. Cada tabla estará dividida en *shards* distribuidos entre distintos nodos de datos, y cada shard será replicado mediante el algoritmo **Raft** para garantizar durabilidad y tolerancia a fallos.

El sistema estará compuesto por dos tipos de nodos principales:

* **RequestRouters**, que recibirán las peticiones de los clientes, resolverán el shard correspondiente a cada clave, y coordinarán tanto las operaciones simples como las transacciones distribuidas.

* **DataNodes**, que almacenarán los datos, replicarán su estado con Raft y mantendrán su información de manera persistente.

La información de configuración —qué tablas existen, cómo se dividen en shards y en qué DataNodes reside cada uno— estará gestionada por **etcd**, un almacenamiento clave-valor replicado mediante Raft, que actuará como servicio de coordinación central. etcd garantizará la consistencia en la creación y eliminación de tablas, así como en la inicialización del sistema.

El trabajo buscará integrar los conceptos vistos en la materia sobre **replicación**, **consistencia**, **coordinación distribuida** y **manejo de concurrencia**. A través de la implementación de Mini-DynamoDB, los estudiantes deberán enfrentarse a los mismos problemas que resuelven los sistemas distribuidos reales: asegurar disponibilidad en presencia de fallas, definir un modelo de consistencia apropiado, y coordinar múltiples nodos sin introducir estados intermedios inconsistentes.

## **2\. Arquitectura general del sistema**

El sistema **Mini-DynamoDB** se compone de tres tipos principales de componentes: **RequestRouters**, **DataNodes** y **etcd**. Además, se provee un **cliente de línea de comandos (CLI)** para la interacción con el servicio. En conjunto, estos elementos conforman un sistema distribuido tolerante a fallos que permite realizar operaciones de lectura, escritura y borrado sobre un almacenamiento clave-valor replicado y particionado.

### **2.1. Componentes principales**

#### **a) RequestRouters**

Los **RequestRouters** son los nodos de entrada del sistema. Reciben las peticiones de los clientes, determinan el shard correspondiente a cada clave y reenvían la operación a uno de los **DataNodes** responsables.

Estos nodos son **totalmente *stateless***: no mantienen ningún estado persistente entre solicitudes. Toda la información sobre tablas, shards o asignaciones se obtiene desde **etcd** o se mantiene temporalmente en una caché de memoria volátil.

Las funciones principales de los RequestRouters incluyen:

* Consultar a **etcd** la configuración actual del sistema (tablas, shards y DataNodes).  
* Enrutar las operaciones `Get`, `Put` y `Delete` hacia un DataNode, el cual va a redirigirlas al líder correspondiente del shard.  
* Mantener un *caché efímero* de configuración para reducir la carga sobre etcd.  
* Recuperarse automáticamente ante fallos o reinicios sin necesidad de sincronización adicional, dado su carácter *stateless*.  
* Cumplir el rol de **Transaction Manager**, coordinando las transacciones distribuidas mediante *two-phase commit* (ver sección 5).

Al ser stateless, los RequestRouters pueden escalar horizontalmente y reemplazarse sin afectar la disponibilidad del sistema.

#### **b) DataNodes**

Los **DataNodes** son los nodos que almacenan los datos de los shards. Cada DataNode puede alojar múltiples shards, incluso de tablas distintas. Cada shard mantiene su propia réplica independiente, implementada mediante el algoritmo de consenso **Raft**, que asegura la consistencia entre réplicas y la durabilidad del estado.

Características clave:

* Implementan **Raft con compactación de logs (snapshotting)** y **persistencia de estado**.  
* Exponen una API gRPC para recibir las operaciones desde los RequestRouters.  
* Rechazan operaciones destinadas a shards que no administran.  
* Pueden alojar shards de múltiples tablas simultáneamente.
* Al iniciar, se registran en etcd asociados a un ***lease*** que renuevan periódicamente (ver sección 2.1c).

**Se debe usar alguna implementación de Raft de las realizadas en el TP2 de alguno de los miembros del grupo.**

Cada shard se replica en un conjunto de **3 o 5 DataNodes**, según se indique al crear la tabla (ver `CreateTable`). El shard debe permanecer **operativo mientras exista una mayoría de réplicas activas**. Por ejemplo, en una configuración de tres réplicas, el shard continúa funcionando si al menos **dos nodos permanecen disponibles y comunicados**. Esto garantiza **tolerancia a fallos** sin comprometer la consistencia del estado replicado.

#### **c) etcd**

**etcd** actúa como el **servicio de coordinación y configuración** del sistema. Es responsable de mantener la configuración global, que incluye:

* La lista de **tablas existentes**.  
* Los **rangos de hash** asignados a cada shard.  
* La **asignación de shards a DataNodes** (sus direcciones o identificadores).
* El **registro de DataNodes disponibles**.
* El **estado de las transacciones** en curso (ver sección 5).

etcd debe garantizar la **consistencia y atomicidad** de las operaciones de configuración, especialmente durante la creación y eliminación de tablas. Para ello deben utilizarse los mecanismos que ofrece etcd: **transacciones** (`Txn`) con comparaciones sobre las revisiones de las claves, de modo que cada cambio de configuración se aplique como una única operación atómica, y ***watches***, para mantener sincronizados a los RequestRouters sin necesidad de consultar periódicamente.

Para el registro de DataNodes deben utilizarse ***leases***: cada DataNode escribe una clave propia (por ejemplo, `/datanodes/<id>`) asociada a un lease que renueva periódicamente. Si el DataNode deja de responder, el lease expira y etcd elimina la clave automáticamente. De este modo, el conjunto de claves vigentes refleja en todo momento los DataNodes disponibles.

etcd debe desplegarse como un **clúster de 3 nodos**, de modo que el servicio de coordinación no constituya un punto único de falla. Se permite utilizar la biblioteca cliente oficial de etcd para Go (`go.etcd.io/etcd/client/v3`).

**En este trabajo no se requiere reconfiguración dinámica: una vez creada una tabla y sus shards, no se agregan ni remueven miembros al shard. Si pueden fallar pero se asume que los mismos eventualmente se recuperan. Esta es una simplificación con fines didácticos que no se puede ignorar en sistemas productivos.**

#### **d) Cliente CLI**

El **cliente de línea de comandos (CLI)** es la interfaz principal de usuario. Permite ejecutar operaciones sobre el sistema, incluyendo tanto las de datos (`Get`, `Put`, `Delete`) como las administrativas (`CreateTable`, `DeleteTable`). 

### **2.2. Flujo general de operaciones**

1. El cliente envía una solicitud (por ejemplo, `Put`) a un RequestRouter.  
2. El RequestRouter consulta a etcd (o su caché local) para identificar el shard y los DataNodes correspondientes.  
3. El RequestRouter envía la operación a **un nodo** del shard. Si este no es el líder, dirige la operación al líder del shard.  
4. El líder replica la operación a sus seguidores según el protocolo Raft.  
5. El líder responde al RequestRouter, que devuelve el resultado al cliente.

Mientras exista una **mayoría de réplicas disponibles**, cada shard puede continuar operando normalmente, incluso si uno o más DataNodes fallan o pierden conectividad temporalmente.

Todas las comunicaciones se deben implementar como gRPC sobre sockets TCP.

## **3\. Administración de tablas**

El sistema **Mini-DynamoDB** debe permitir la creación y eliminación de tablas, administradas de forma centralizada mediante **etcd**. Cada tabla se compone de un conjunto de *shards* distribuidos entre los **DataNodes**, y su existencia, configuración y estado deben estar reflejados en etcd, que actúa como registro único de la configuración global del sistema.

### **3.1. Requerimientos generales**

* Toda tabla debe tener un **nombre único** dentro del sistema.  
* Cada tabla debe especificar al momento de su creación el **número de shards** que la compondrán.  
* Cada clave se asigna a un shard según el valor de una **función de hash** estable aplicada sobre ella (por ejemplo, FNV-1a o MD5). Cada grupo puede elegir la función, y debe documentarla. El espacio de hash se divide en rangos de igual tamaño, uno por shard.
* Los shards deben asignarse a los DataNodes disponibles de manera **aleatoria**, y cada uno debe tener **3 o 5 réplicas** según se indique al crear la tabla.
* La relación entre tablas, shards y DataNodes debe mantenerse registrada de forma persistente y consistente en etcd.  
* Un **DataNode puede alojar múltiples shards**, incluso pertenecientes a distintas tablas.  
* No se requiere reconfiguración dinámica: una vez creada una tabla, su estructura y asignación de shards permanece fija.

### **3.2. Operación `CreateTable`**

`CreateTable <nombre> <número_de_shards> <número_de_réplicas>`

donde `<número_de_réplicas>` debe ser 3 o 5.

La operación debe:

* Registrar la existencia de una nueva tabla en etcd.
* Definir el número de shards y los rangos de hash asociados.
* Asignar de forma aleatoria los shards a los DataNodes disponibles, es decir, aquellos registrados en etcd con un *lease* vigente.
* Inicializar los metadatos correspondientes, incluyendo el número de réplicas por shard.

El sistema debe garantizar que la creación de tablas es **atómica y consistente**, evitando estados parciales o configuraciones incompletas.

### **3.3. Operación `DeleteTable`**

`DeleteTable <nombre>`

La operación debe:

* Marcar la tabla con el estado `deleting` en etcd. A partir de ese momento, la tabla deja de ser visible y accesible desde los RequestRouters y el cliente.
* Indicar a los DataNodes que eliminen los shards correspondientes. Cada DataNode detecta el cambio mediante un *watch* y, una vez eliminados sus shards, lo confirma en etcd.
* Eliminar los metadatos de la tabla en etcd una vez que todos los DataNodes involucrados hayan confirmado el borrado.

Si un DataNode está caído en el momento del borrado, al recuperarse debe consultar etcd y eliminar los shards de las tablas en estado `deleting`. Mientras la tabla se encuentre en ese estado, no puede crearse otra con el mismo nombre.

La eliminación debe realizarse de manera **segura y definitiva**: una vez que todos los DataNodes involucrados se hayan recuperado, no deben quedar shards huérfanos ni configuraciones residuales.

### **3.4. Metadatos en etcd**

Para cada tabla, etcd debe almacenar:

* El **nombre de la tabla**.  
* El **número total de shards**.  
* Los **rangos de hash** correspondientes a cada shard.  
* Las **direcciones o identificadores** de los DataNodes asignados a cada shard.  
* El **número de réplicas** por shard.  
* El **estado** de la tabla (`creating`, `available`, `deleting`).

Toda esta información debe ser consultable por los RequestRouters para el enrutamiento de operaciones.

## **4\. Consistencia y modelo de lecturas**

El sistema debe ofrecer un modelo de consistencia configurable, con soporte tanto para **lecturas eventualmente consistentes** como para **lecturas fuertemente consistentes (linealizables)**, siguiendo la semántica de DynamoDB.

### **4.1. Requerimientos generales**

* Todas las operaciones deben asegurar que los datos almacenados en las distintas réplicas de un shard converjan al mismo valor.  
* Las operaciones de escritura deben preservar un orden global dentro de cada shard.  
* El sistema debe permitir que los clientes elijan, para cada lectura, el nivel de consistencia deseado.

### **4.2. Operación `Get`**

* La operación `Get` debe aceptar un **parámetro opcional** que indique el nivel de consistencia:

  * **`consistent=false`** (por defecto): lectura eventual.  
  * **`consistent=true`**: lectura fuertemente consistente.

* Las lecturas eventuales pueden ser respondidas por cualquier réplica disponible.  
* Las lecturas fuertes deben reflejar el estado más reciente confirmado por la mayoría.

### **4.3. Operaciones `Put` y `Delete`**

* Las operaciones `Put` y `Delete` deben aplicarse de forma ordenada y garantizar que no existan versiones conflictivas dentro del mismo shard.  
* Si un shard no puede asegurar un estado consistente (por pérdida de quorum o error de sincronización), las escrituras deben ser rechazadas.  
* Las escrituras deben ser visibles inmediatamente para lecturas fuertes y de forma eventual para lecturas débiles.

### **4.4. Disponibilidad**

* Cada shard debe continuar procesando operaciones mientras conserve **una mayoría de réplicas activas**.  
* Si un shard pierde la mayoría, solo se permiten lecturas eventuales.

## **5\. Transacciones distribuidas**

El sistema debe incorporar soporte para transacciones distribuidas mediante ***two-phase commit***, con el **control de concurrencia optimista basado en timestamps** que describen Idziorek et al. para Amazon DynamoDB. El Transaction Manager asigna un timestamp a cada transacción, y los DataNodes la aceptan o la rechazan según ese orden, sin tomar locks. Este modelo debe detectar conflictos de concurrencia y abortar la transacción en caso de inconsistencias, permitiendo al cliente reintentarla.

Se deberán soportar dos tipos de transacciones:

* **Put transaccional:** agrupa múltiples operaciones `Put` (y solo `Put`) que deben aplicarse de forma **atómica**, es decir, todas o ninguna.  
* **Get transaccional:** permite realizar un conjunto de lecturas (`Get`) que reflejen un **estado consistente del sistema**, actuando como un *snapshot* transaccional.

Las transacciones deben poder involucrar **múltiples tablas y múltiples shards**. El **RequestRouter** debe **implementar el Transaction Manager**, siendo responsable de coordinar el inicio, validación, commit y abort de cada transacción.

El estado del Transaction Manager y sus transacciones (pendiente, confirmada o abortada) debe persistirse en **etcd**, garantizando la **recuperación ante fallas**, incluso en caso de caída del Transaction Manager o de los nodos participantes.

Cada transacción en curso debe quedar asociada al *lease* del RequestRouter que la coordina. Si ese RequestRouter falla y su lease expira, cualquier otro RequestRouter debe poder retomar la transacción y completarla: confirmarla si la decisión de commit ya había sido persistida, o abortarla en caso contrario.

## **6\. Bibliografía**

* M. Elhemali et al., “Amazon DynamoDB: A Scalable, Predictably Performant, and Fully Managed NoSQL Database Service,” in Proc. 2022 USENIX Annu. Tech. Conf. (USENIX ATC 22), Carlsbad, CA, USA, Jul. 2022, pp. 1037–1048. \[Online\]. Available: [https://www.usenix.org/conference/atc22/presentation/elhemali](https://www.usenix.org/conference/atc22/presentation/elhemali)  
* The etcd Authors, “etcd Documentation.” \[Online\]. Available: [https://etcd.io/docs/](https://etcd.io/docs/)
* D. Ongaro and J. Ousterhout, “In Search of an Understandable Consensus Algorithm,” in Proc. 2014 USENIX Annu. Tech. Conf. (USENIX ATC 14), Philadelphia, PA, USA, Jun. 2014, pp. 305–319. \[Online\]. Available: [https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro](https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro)  
* J. Idziorek et al., “Distributed Transactions at Scale in Amazon DynamoDB,” in Proc. 2023 USENIX Annu. Tech. Conf. (USENIX ATC 23), Boston, MA, USA, Jul. 2023, pp. 705–717. \[Online\]. Available: [https://www.usenix.org/conference/atc23/presentation/idziorek](https://www.usenix.org/conference/atc23/presentation/idziorek)
