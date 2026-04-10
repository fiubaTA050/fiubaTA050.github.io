---
layout: page
title: TP2 - Raft
permalink: /trabajos-practicos/tp2-raft/
---

# Introducción

Este es el primero de una serie de trabajos prácticos en los que construirán un sistema de almacenamiento clave/valor tolerante a fallos. En este TP implementarán **Raft**, un protocolo de máquina de estados replicada. En el siguiente TP construirán un servicio clave/valor sobre Raft.

Un servicio replicado logra tolerancia a fallos almacenando copias completas de su estado (es decir, sus datos) en múltiples servidores réplica. La replicación permite que el servicio siga operando incluso si algunos de sus servidores sufren fallas (caídas o problemas de red). El desafío es que las fallas pueden causar que las réplicas mantengan copias diferentes de los datos.

Raft organiza las solicitudes de los clientes en una secuencia llamada **log**, y asegura que todos los servidores réplica vean el mismo log. Cada réplica ejecuta las solicitudes de los clientes en el orden del log, aplicándolas a su copia local del estado del servicio. Como todas las réplicas activas ven el mismo contenido del log, ejecutan las mismas solicitudes en el mismo orden y, por lo tanto, mantienen un estado de servicio idéntico. Si un servidor falla pero luego se recupera, Raft se encarga de actualizar su log. Raft continuará operando mientras al menos una **mayoría** de los servidores estén activos y puedan comunicarse entre sí. Si no existe tal mayoría, Raft no avanzará, pero retomará donde quedó en cuanto una mayoría pueda comunicarse nuevamente.

En este TP implementarán Raft como un tipo de objeto en Go con sus métodos asociados, pensado para ser usado como módulo en un servicio más grande. Un conjunto de instancias de Raft se comunican entre sí mediante RPC para mantener logs replicados. La interfaz de Raft soportará una secuencia indefinida de comandos numerados, también llamados **entradas de log**. Las entradas están numeradas con **índices**. La entrada del log con un índice dado eventualmente será *committed*. En ese momento, la implementación de Raft debe enviar la entrada de log al servicio más grande para que la ejecute.

Deben seguir el diseño del [paper extendido de Raft](https://pdos.csail.mit.edu/6.824/papers/raft-extended.pdf), con especial atención a la **Figura 2**. Implementarán la mayor parte de lo descrito en el paper, incluyendo guardar estado persistente y leerlo después de que un nodo falle y luego reinicie. **No** implementarán cambios de membresía del cluster (Sección 6).

Pueden encontrar útiles esta [guía para estudiantes de Raft](https://thesquareplanet.com/blog/students-guide-to-raft/), estos consejos sobre [locking](https://pdos.csail.mit.edu/6.824/labs/raft-locking.txt) y [estructura](https://pdos.csail.mit.edu/6.824/labs/raft-structure.txt) para concurrencia, y este [diagrama de interacciones de Raft](https://pdos.csail.mit.edu/6.824/notes/raft_diagram.pdf).

Tengan presente que la parte más desafiante de este TP puede no ser implementar la solución, sino debuggearla. Para ayudar con esto, dediquen tiempo a pensar cómo hacer que la implementación sea más fácil de depurar. Pueden consultar [este blog post sobre print statements efectivos](https://blog.josejg.com/debugging-pretty/).

Este trabajo práctico se divide en **cuatro partes**: 2A, 2B, 2C y 2D.

# El código

Implementarán Raft agregando código en `raft/raft.go`. Allí encontrarán código esqueleto, además de ejemplos de cómo enviar y recibir RPCs.

La implementación debe soportar la siguiente interfaz, que los tests (y eventualmente el servidor clave/valor) usarán. Encontrarán más detalles en los comentarios de `raft.go`.

```go
// crear una nueva instancia del servidor Raft:
rf := Make(peers, me, persister, applyCh)

// iniciar el acuerdo sobre una nueva entrada de log:
rf.Start(command interface{}) (index, term, isleader)

// consultar a un Raft por su term actual y si cree ser líder
rf.GetState() (term, isLeader)

// cada vez que una nueva entrada es committed en el log,
// cada peer Raft debe enviar un ApplyMsg al servicio (o al tester).
type ApplyMsg
```

Un servicio llama a `Make(peers, me, ...)` para crear un peer Raft. El argumento `peers` es un array de identificadores de red de los peers Raft (incluyendo el propio), para uso con RPC. El argumento `me` es el índice de este peer en el array. `Start(command)` le pide a Raft que inicie el procesamiento para agregar el comando al log replicado. `Start()` debe retornar inmediatamente, sin esperar a que las operaciones de append completen. El servicio espera que la implementación envíe un `ApplyMsg` por cada nueva entrada de log *committed* al canal `applyCh` pasado como argumento a `Make()`.

`raft.go` contiene código de ejemplo que envía un RPC (`sendRequestVote()`) y que maneja un RPC entrante (`RequestVote()`). Los peers Raft deben intercambiar RPCs usando el paquete Go `labrpc` (código fuente en `src/labrpc`). Los tests pueden indicarle a `labrpc` que retrase RPCs, los reordene y los descarte para simular diversas fallas de red. Si bien pueden modificar `labrpc` temporalmente, asegúrense de que Raft funcione con el `labrpc` original, ya que es el que se usará para los tests. Las instancias de Raft deben interactuar **únicamente** a través de RPC; por ejemplo, no está permitido comunicarse usando variables compartidas de Go ni archivos.

Los trabajos prácticos subsiguientes se construyen sobre éste, así que es importante darse tiempo suficiente para escribir código sólido.

# Parte 2A: Elección de líder

Implementen la **elección de líder** y los **heartbeats** de Raft (RPCs `AppendEntries` sin entradas de log). El objetivo de la Parte 2A es que se elija un único líder, que el líder permanezca como tal si no hay fallas, y que un nuevo líder asuma si el antiguo falla o si los paquetes desde/hacia el antiguo líder se pierden.

Para ejecutar los tests de la parte 2A:

```
$ cd src/raft
$ go test -run 2A
```

## Consejos

* Sigan la **Figura 2** del paper. En esta etapa deben enfocarse en enviar y recibir RPCs `RequestVote`, las Reglas para Servidores relacionadas con elecciones, y el Estado relacionado con la elección de líder.

* Agreguen el estado de la Figura 2 para elección de líder al struct `Raft` en `raft.go`. También necesitarán definir un struct para contener la información de cada entrada de log.

* Completen los structs `RequestVoteArgs` y `RequestVoteReply`. Modifiquen `Make()` para crear una goroutine en segundo plano que inicie una elección de líder periódicamente enviando RPCs `RequestVote` cuando no haya recibido comunicación de otro peer por un tiempo. De esta manera, un peer aprenderá quién es el líder si ya hay uno, o se convertirá en líder él mismo. Implementen el handler de RPC `RequestVote()` para que los servidores voten entre sí.

* Para implementar heartbeats, definan un struct de RPC `AppendEntries` (aunque puede que no necesiten todos los argumentos aún), y hagan que el líder los envíe periódicamente. Escriban un método handler para el RPC `AppendEntries` que resetee el timeout de elección para que otros servidores no se postulen como líderes cuando ya hay uno elegido.

* Asegúrense de que los timeouts de elección de los distintos peers no se disparen siempre al mismo tiempo, o todos los peers votarán solo por sí mismos y nadie se convertirá en líder.

* Los tests requieren que el líder envíe RPCs de heartbeat **no más de diez veces por segundo**.

* Los tests requieren que Raft elija un nuevo líder dentro de **cinco segundos** desde la falla del líder anterior (si una mayoría de los peers aún puede comunicarse). Recuerden, sin embargo, que la elección de líder puede requerir múltiples rondas en caso de un *split vote* (que puede ocurrir si los paquetes se pierden o si los candidatos eligen los mismos tiempos de backoff aleatorios). Deben elegir timeouts de elección (y por lo tanto intervalos de heartbeat) lo suficientemente cortos para que sea muy probable que una elección se complete en menos de cinco segundos incluso si requiere múltiples rondas.

* La Sección 5.2 del paper menciona timeouts de elección en el rango de 150 a 300 milisegundos. Ese rango solo tiene sentido si el líder envía heartbeats considerablemente más seguido que una vez cada 150 milisegundos. Dado que los tests limitan los heartbeats a diez por segundo, deberán usar un timeout de elección mayor que los 150-300 ms del paper, pero no demasiado grande, porque de lo contrario podrían no lograr elegir un líder dentro de cinco segundos.

* Pueden usar el paquete [rand](https://golang.org/pkg/math/rand/) de Go para generar valores aleatorios.

* Necesitarán escribir código que tome acciones periódicamente o tras ciertos delays. La forma más sencilla es crear una goroutine con un loop que llame a [time.Sleep()](https://golang.org/pkg/time/#Sleep); vean la goroutine `ticker()` que `Make()` crea para este propósito. No usen `time.Timer` ni `time.Ticker` de Go, que son difíciles de usar correctamente.

* Si el código tiene problemas para pasar los tests, relean la **Figura 2** del paper; la lógica completa de elección de líder está distribuida en múltiples partes de la figura.

* No olviden implementar `GetState()`.

* Los tests llaman a `rf.Kill()` cuando apagan una instancia permanentemente. Pueden verificar si `Kill()` fue llamado usando `rf.killed()`. Pueden querer hacer esto en todos los loops, para evitar que instancias muertas de Raft impriman mensajes confusos.

* Go RPC solo envía campos de structs cuyos nombres empiecen con **mayúscula**. Las subestructuras también deben tener nombres de campos en mayúscula (por ejemplo, campos de registros de log en un array). El paquete `labgob` les advertirá sobre esto; no ignoren las advertencias.

## Salida esperada

Asegúrense de pasar los tests de 2A antes de avanzar:

```
$ go test -run 2A
Test (2A): initial election ...
  ... Passed --   3.5  3   58   16840    0
Test (2A): election after network failure ...
  ... Passed --   5.4  3  118   25269    0
Test (2A): multiple elections ...
  ... Passed --   7.3  7  624  138014    0
PASS
ok  	6.824/raft	16.265s
```

Cada línea "Passed" contiene cinco números: el tiempo que tomó el test en segundos, la cantidad de peers Raft, la cantidad de RPCs enviados durante el test, el total de bytes en los mensajes RPC, y la cantidad de entradas de log reportadas como committed. Sus números diferirán de los mostrados aquí. Pueden ignorar los números si quieren, pero les pueden servir para verificar la cantidad de RPCs que envía la implementación. Los tests fallarán la solución si toman más de 600 segundos en total (`go test`), o si cualquier test individual toma más de 120 segundos.

# Parte 2B: Log

Implementen el código de líder y follower para agregar nuevas entradas de log, de manera que pasen todos los tests de 2B:

```
$ go test -run 2B
```

## Consejos

* Su primer objetivo debe ser pasar `TestBasicAgree2B()`. Comiencen implementando `Start()`, luego escriban el código para enviar y recibir nuevas entradas de log mediante RPCs `AppendEntries`, siguiendo la Figura 2.

* Necesitarán implementar la **restricción de elección** (sección 5.4.1 del paper).

* Una manera de fallar los tests tempranos de 2B es mantener elecciones repetidas a pesar de que el líder está activo. Busquen bugs en el manejo del timer de elección, o que no estén enviando heartbeats inmediatamente después de ganar una elección.

* Su código puede tener loops que chequeen repetidamente ciertos eventos. No hagan que estos loops se ejecuten continuamente sin pausar, ya que eso ralentizará la implementación lo suficiente como para fallar los tests. Usen [variables de condición](https://golang.org/pkg/sync/#Cond) de Go, o inserten un `time.Sleep(10 * time.Millisecond)` en cada iteración del loop.

* Háganle un favor a su futuro yo y escriban (o reescriban) código limpio y claro.

* Si fallan un test, miren `config.go` y `test_test.go` para entender mejor qué se está testeando. `config.go` también ilustra cómo el tester usa la API de Raft.

## Consideraciones de rendimiento

Los tests de futuros TPs pueden fallar si el código es demasiado lento. Pueden verificar cuánto tiempo real y de CPU usa la solución con el comando `time`. Salida típica:

```
$ time go test -run 2B
Test (2B): basic agreement ...
  ... Passed --   0.9  3   16    4572    3
Test (2B): RPC byte count ...
  ... Passed --   1.7  3   48  114536   11
Test (2B): agreement despite follower disconnection ...
  ... Passed --   3.6  3   78   22131    7
Test (2B): no agreement if too many followers disconnect ...
  ... Passed --   3.8  5  172   40935    3
Test (2B): concurrent Start()s ...
  ... Passed --   1.1  3   24    7379    6
Test (2B): rejoin of partitioned leader ...
  ... Passed --   5.1  3  152   37021    4
Test (2B): leader backs up quickly over incorrect follower logs ...
  ... Passed --  17.2  5 2080 1587388  102
Test (2B): RPC counts aren't too high ...
  ... Passed --   2.2  3   60   20119   12
PASS
ok  	6.824/raft	35.557s

real	0m35.899s
user	0m2.556s
sys	0m1.458s
```

Si la solución usa mucho más de un minuto de tiempo real para los tests de 2B, o mucho más de 5 segundos de tiempo de CPU, pueden tener problemas más adelante. Busquen tiempo gastado en sleeps o esperando timeouts de RPC, loops que corran sin dormir ni esperar condiciones o mensajes de canales, o grandes cantidades de RPCs enviados.

# Parte 2C: Persistencia

Si un servidor basado en Raft se reinicia, debe retomar el servicio donde lo dejó. Esto requiere que Raft mantenga **estado persistente** que sobreviva un reinicio. La Figura 2 del paper menciona qué estado debe ser persistente.

Una implementación real escribiría el estado persistente de Raft a disco cada vez que cambie, y lo leería del disco al reiniciar. La implementación de este TP no usará el disco; en su lugar, guardará y restaurará el estado persistente desde un objeto `Persister` (ver `persister.go`). Quien llame a `Raft.Make()` proporcionará un `Persister` que inicialmente contiene el estado persistido más reciente de Raft (si existe). Raft debe inicializar su estado desde ese `Persister`, y debe usarlo para guardar su estado persistente cada vez que el estado cambie. Usen los métodos `ReadRaftState()` y `SaveRaftState()` del `Persister`.

Completen las funciones `persist()` y `readPersist()` en `raft.go` agregando código para guardar y restaurar el estado persistente. Necesitarán codificar ("serializar") el estado como un array de bytes para pasarlo al `Persister`. Usen el encoder `labgob`; vean los comentarios en `persist()` y `readPersist()`. `labgob` es como el encoder `gob` de Go pero imprime mensajes de error si intentan encodear structs con nombres de campos en minúscula.

Inserten llamadas a `persist()` en los puntos donde la implementación cambie estado persistente. Una vez hecho esto, y si el resto de la implementación es correcto, deberían pasar todos los tests de 2C.

## Consejos

* Los tests de 2C son más exigentes que los de 2A o 2B, y las fallas pueden ser causadas por problemas en el código de 2A o 2B. Aunque pasen 2A y 2B consistentemente, pueden todavía tener bugs de elección o de log que se manifiesten en los tests de 2C.

* Probablemente necesitarán la optimización que retrocede `nextIndex` más de una entrada a la vez. Miren el [paper extendido de Raft](https://pdos.csail.mit.edu/6.824/papers/raft-extended.pdf) comenzando al final de la página 7 y al principio de la página 8 (marcado con una línea gris). El paper es vago sobre los detalles; deberán completar los vacíos. Una posibilidad es que un mensaje de rechazo incluya:

```
XTerm:  term en la entrada conflictiva (si existe)
XIndex: índice de la primera entrada con ese term (si existe)
XLen:   longitud del log
```

Entonces la lógica del líder puede ser algo como:

```
  Caso 1: el líder no tiene XTerm:
    nextIndex = XIndex
  Caso 2: el líder tiene XTerm:
    nextIndex = última entrada del líder para XTerm
  Caso 3: el log del follower es demasiado corto:
    nextIndex = XLen
```

## Salida esperada

El código debe pasar todos los tests de 2C, así como los de 2A y 2B.

```
$ go test -run 2C
Test (2C): basic persistence ...
  ... Passed --   5.0  3   86   22849    6
Test (2C): more persistence ...
  ... Passed --  17.6  5  952  218854   16
Test (2C): partitioned leader and one follower crash, leader restarts ...
  ... Passed --   2.0  3   34    8937    4
Test (2C): Figure 8 ...
  ... Passed --  31.2  5  580  130675   32
Test (2C): unreliable agreement ...
  ... Passed --   1.7  5 1044  366392  246
Test (2C): Figure 8 (unreliable) ...
  ... Passed --  33.6  5 10700 33695245  308
Test (2C): churn ...
  ... Passed --  16.1  5 8864 44771259 1544
Test (2C): unreliable churn ...
  ... Passed --  16.5  5 4220 6414632  906
PASS
ok  	6.824/raft	123.564s
```

Es buena idea correr los tests múltiples veces antes de dar por terminada cada parte.

```
$ for i in {0..10}; do go test; done
```

# Parte 2D: Compactación del log

Tal como está, un servidor que reinicia reproduce el log completo de Raft para restaurar su estado. Sin embargo, no es práctico para un servicio de larga duración recordar el log completo de Raft para siempre. En su lugar, modificarán Raft para cooperar con servicios que almacenan persistentemente un **snapshot** de su estado de vez en cuando, momento en el cual Raft descarta las entradas de log previas al snapshot. El resultado es una menor cantidad de datos persistentes y un reinicio más rápido. Sin embargo, ahora es posible que un follower quede tan atrasado que el líder haya descartado las entradas de log que necesita para ponerse al día; el líder entonces debe enviar un snapshot más el log a partir del momento del snapshot. La Sección 7 del [paper extendido de Raft](https://pdos.csail.mit.edu/6.824/papers/raft-extended.pdf) describe el esquema; deberán diseñar los detalles.

Pueden consultar el [diagrama de interacciones de Raft](https://pdos.csail.mit.edu/6.824/notes/raft_diagram.pdf) para entender cómo el servicio replicado y Raft se comunican.

Raft debe proveer la siguiente función que el servicio puede llamar con un snapshot serializado de su estado:

```go
Snapshot(index int, snapshot []byte)
```

En esta parte, los tests llaman a `Snapshot()` periódicamente. En el TP3, escribirán un servidor clave/valor que llame a `Snapshot()`; el snapshot contendrá la tabla completa de pares clave/valor. La capa de servicio llama a `Snapshot()` en cada peer (no solo en el líder).

El argumento `index` indica la entrada de log más alta que está reflejada en el snapshot. Raft debe descartar sus entradas de log anteriores a ese punto. Necesitarán revisar el código de Raft para que opere almacenando solamente la cola del log.

Necesitarán implementar el RPC `InstallSnapshot` discutido en el paper, que permite que un líder Raft le indique a un peer atrasado que reemplace su estado con un snapshot. Probablemente necesitarán pensar cómo `InstallSnapshot` debe interactuar con el estado y las reglas de la Figura 2. Noten que los RPCs `InstallSnapshot` se envían *entre* peers Raft, mientras que `Snapshot` es usado por el servicio para comunicarse con Raft.

Cuando el código Raft de un follower recibe un RPC `InstallSnapshot`, puede usar `applyCh` para enviar el snapshot al servicio en un `ApplyMsg`. La definición del struct `ApplyMsg` ya contiene los campos que necesitarán (y que los tests esperan). Tengan cuidado de que estos snapshots solo avancen el estado del servicio, y no lo hagan retroceder.

Si un servidor se cae, debe reiniciar desde datos persistidos. Raft debe persistir tanto el estado de Raft como el snapshot correspondiente. Usen `persister.SaveStateAndSnapshot()`, que toma argumentos separados para el estado de Raft y el snapshot correspondiente. Si no hay snapshot, pasen `nil` como argumento de snapshot.

Cuando un servidor reinicia, la capa de aplicación lee el snapshot persistido y restaura su estado guardado.

Anteriormente, se recomendaba implementar una función llamada `CondInstallSnapshot` para evitar el requerimiento de que los snapshots y las entradas de log enviadas por `applyCh` estén coordinados. Esta interfaz vestigial permanece en el código, pero no es necesario implementarla: simplemente hagan que retorne `true`.

Implementen `Snapshot()` y el RPC `InstallSnapshot`, así como los cambios a Raft para soportar estos (por ejemplo, operar con un log recortado). La solución está completa cuando pasa los tests de 2D (y todos los tests previos del TP).

## Consejos

* Un buen punto de partida es modificar el código para que sea capaz de almacenar solo la parte del log a partir de cierto índice X. Inicialmente pueden fijar X en cero y correr los tests de 2B/2C. Luego hagan que `Snapshot(index)` descarte el log antes de `index` y fije X igual a `index`. Si todo va bien, deberían pasar el primer test de 2D.

* No podrán almacenar el log en un slice de Go y usar los índices del slice intercambiablemente con los índices de log de Raft; necesitarán indexar el slice de una manera que tenga en cuenta la porción descartada del log.

* Siguiente paso: hagan que el líder envíe un RPC `InstallSnapshot` si no tiene las entradas de log requeridas para actualizar a un follower.

* Envíen el snapshot completo en un único RPC `InstallSnapshot`. No implementen el mecanismo de offset de la Figura 13 para dividir el snapshot.

* Raft debe descartar las entradas antiguas del log de una manera que permita al garbage collector de Go liberar y reutilizar la memoria; esto requiere que no haya referencias (punteros) alcanzables a las entradas descartadas del log.

* Aun cuando el log esté recortado, la implementación debe enviar correctamente el term e index de la entrada previa a las nuevas entradas en los RPCs `AppendEntries`; esto puede requerir guardar y referenciar el `lastIncludedTerm`/`lastIncludedIndex` del último snapshot (consideren si esto debe ser persistido).

* Raft debe almacenar cada snapshot en el persister usando `SaveStateAndSnapshot()`.

* Un tiempo razonable para el conjunto completo de tests del TP (2A+2B+2C+2D) sin `-race` es de 6 minutos de tiempo real y un minuto de tiempo de CPU. Con `-race`, es alrededor de 10 minutos de tiempo real y dos minutos de CPU.

## Salida esperada

El código debe pasar todos los tests de 2D, así como los de 2A, 2B y 2C.

```
$ go test -run 2D
Test (2D): snapshots basic ...
  ... Passed --  11.6  3  176   61716  192
Test (2D): install snapshots (disconnect) ...
  ... Passed --  64.2  3  878  320610  336
Test (2D): install snapshots (disconnect+unreliable) ...
  ... Passed --  81.1  3 1059  375850  341
Test (2D): install snapshots (crash) ...
  ... Passed --  53.5  3  601  256638  339
Test (2D): install snapshots (unreliable+crash) ...
  ... Passed --  63.5  3  687  288294  336
PASS
ok      6.824/raft      293.456s
```

# Referencias

* Paper extendido de Raft: [In Search of an Understandable Consensus Algorithm](https://pdos.csail.mit.edu/6.824/papers/raft-extended.pdf)
* Visualización interactiva de Raft: [https://raft.github.io/](https://raft.github.io/)
* Guía para estudiantes de Raft: [https://thesquareplanet.com/blog/students-guide-to-raft/](https://thesquareplanet.com/blog/students-guide-to-raft/)
* Diagrama de interacciones de Raft: [https://pdos.csail.mit.edu/6.824/notes/raft_diagram.pdf](https://pdos.csail.mit.edu/6.824/notes/raft_diagram.pdf)
* Consejos de locking: [https://pdos.csail.mit.edu/6.824/labs/raft-locking.txt](https://pdos.csail.mit.edu/6.824/labs/raft-locking.txt)
* Consejos de estructura: [https://pdos.csail.mit.edu/6.824/labs/raft-structure.txt](https://pdos.csail.mit.edu/6.824/labs/raft-structure.txt)
* Go Programming Language: [https://go.dev/](https://go.dev/)

---

<small>Este trabajo práctico es una adaptación del [Lab 2: Raft](http://nil.csail.mit.edu/6.824/2022/labs/lab-raft.html) del curso [6.824 Distributed Systems](http://nil.csail.mit.edu/6.824/2022/) del MIT (Robert Morris, Frans Kaashoek y Nickolai Zeldovich), traducido al castellano y con modificaciones menores para adaptarlo a la materia. El material original está licenciado bajo [Creative Commons BY 3.0 US](https://creativecommons.org/licenses/by/3.0/us/).</small>
