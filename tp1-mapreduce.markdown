---
layout: page
title: TP1 - MapReduce
permalink: /trabajos-practicos/tp1-mapreduce/
---

# Introducción

En este trabajo práctico deberán construir un sistema **MapReduce distribuido** desde cero, escrito en **Go**. Implementarán un proceso **coordinador**, encargado de repartir tareas de *Map* y *Reduce* y de manejar la detección de fallos, y múltiples procesos **worker**, que ejecutarán las funciones de aplicación y se comunicarán con el coordinador.

El sistema usará [**gRPC**](https://grpc.io/) **sobre Unix Domain Sockets** para la comunicación entre procesos, y las funciones de *Map* y *Reduce* se cargarán dinámicamente mediante [**plugins de Go**](https://pkg.go.dev/plugin).

Su implementación deberá ser capaz de ejecutar las siguientes aplicaciones MapReduce:

* **Word count** sobre archivos de texto de Project Gutenberg (`pg-*.txt`).

* Otra aplicación a elección, preferentemente alguna citada en el paper de MapReduce (por ejemplo, un índice invertido de palabras).

* Una variante de **word count con fallos simulados**, donde los workers fallen aleatoriamente durante la ejecución y el coordinador reasigne las tareas.

El sistema tendrá dos modos de ejecución:

1. **Secuencial**, con un único proceso que ejecute todo el trabajo de manera ordenada.

2. **Distribuido**, con un coordinador y múltiples workers en paralelo, incluyendo tolerancia a fallos de workers.

Al finalizar, contarán con un sistema inspirado en el diseño original de MapReduce que les permitirá comprender en profundidad cómo funciona este modelo de programación en un entorno distribuido.

# Desarrollo

Los datos de entrada serán archivos de texto de [**Project Gutenberg**](https://www.gutenberg.org/) (`pg-*.txt`). Cada archivo corresponderá a un *split* y será procesado por una tarea *Map*.

Su primera tarea será implementar la versión **secuencial** de MapReduce. Esta versión ejecutará las funciones de *Map* y *Reduce* en un solo proceso, sin concurrencia, y servirá como referencia para validar el sistema distribuido.

Luego, deberán implementar la versión **distribuida**, que consistirá en:

* Un proceso **coordinador**, encargado de asignar tareas y controlar el progreso del job.

* Uno o más procesos **worker**, que solicitarán trabajo al coordinador, ejecutarán la función indicada y devolverán los resultados.

Las funciones de *Map* y *Reduce* se implementarán en archivos independientes y deberán compilarse como **plugins de Go**. Por ejemplo, para compilar la aplicación de *word count*:

`go build -buildmode=plugin wc.go`

Esto generará un archivo `wc.so` que podrá ser cargado dinámicamente por los workers.

Cada worker deberá, en un ciclo: pedir una tarea al coordinador, leer los archivos de entrada correspondientes, ejecutar la función de *Map* o *Reduce* (cargada desde un **plugin de Go)**, escribir la salida en uno o más archivos, y volver a solicitar una nueva tarea.

El coordinador debe detectar si un worker no completa su tarea en un tiempo razonable (para este TP, **10 segundos**) y asignar esa misma tarea a otro worker. Además, debe finalizar únicamente cuando todas las tareas de *Map* y *Reduce* estén completas.

Este trabajo práctico asume que **todos los procesos comparten el mismo filesystem**. Eso resulta sencillo cuando coordinador y workers corren en la misma máquina, ya que los archivos de entrada, intermedios y de salida están disponibles para todos. Sin embargo, si los procesos se ejecutaran en distintas máquinas, sería necesario contar con un **filesystem global** (como GFS, HDFS u otro equivalente distribuido) para permitir que los workers accedan a los mismos datos.

Por esta misma razón, **no es necesario implementar ningún mecanismo para transferir archivos** entre coordinador y workers mediante gRPC u otros métodos. El coordinador puede simplemente enviar el **path del archivo** en su respuesta, y el worker se encargará de leer directamente el archivo de entrada o intermedio desde el filesystem compartido.

## Ejecución

Para ejecutar el código sobre la aplicación de *word count*, primero deberán correr el coordinador con los archivos de entrada:

`go run coordinator.go pg-*.txt`

En una o más terminales adicionales, podrán lanzar los workers indicando qué plugin usar:

`go run worker.go wc.so`

Cuando el coordinador y los workers terminen, los resultados estarán en archivos `mr-out-*`. La unión de todos esos archivos (ordenados) debe coincidir exactamente con el output de la versión secuencial:

`cat mr-out-* | sort | more`  
 `A 509`  
 `ABOUT 2`  
 `ACT 8`  
 `...`

## Tests

Deberán desarrollar **tests automáticos** que validen el funcionamiento del sistema en sus dos modos (secuencial y distribuido).

## Requisitos de los tests

* Los tests deben ejecutar la versión secuencial, guardar su salida como referencia, luego ejecutar la versión distribuida con la misma entrada y finalmente comparar los resultados.

* Deben confirmar que las salidas coincidan exactamente (ordenadas cuando corresponda) y reportar éxito o fracaso de manera automática.

* El caso de *word count con fallos* debe demostrar que efectivamente se produjo al menos un fallo de worker durante la ejecución, y que el sistema logró recuperar las tareas para producir un resultado correcto. Usar el output del word count sin fallos secuencial como resultado de referencia.

* Los tests pueden implementarse en bash, Go u otro lenguaje que prefieran, siempre que el proceso esté completamente automatizado.

# Reglas

* La comunicación entre coordinador y workers debe hacerse mediante **gRPC sobre Unix Domain Sockets**.

* Los workers deben cargar dinámicamente las funciones *Map* y *Reduce* desde un **plugin de Go** (`.so`).

* El coordinador debe asignar tareas de *Map* y *Reduce* a los workers, supervisarlas y reasignarlas en caso de fallo.

* Los archivos intermedios producidos por las tareas *Map* deben nombrarse `mr-X-Y` donde `X` es el número de tarea *Map* y `Y` el número de tarea *Reduce*.

* Cada tarea *Reduce* debe generar un archivo de salida llamado `mr-out-N`.

* Cada línea de un archivo `mr-out-N` debe tener exactamente el formato `clave valor`, usando `fmt.Printf("%v %v\n", key, value)` en Go.

* Los workers deben terminar cuando el coordinador finaliza su ejecución. Una estrategia posible es que el worker termine al obtener un error de comunicación con el coordinador al haber eliminado el socket.

### **Referencias**

* Go Programming Language: [https://go.dev/](https://go.dev/)

* gRPC en Go: [https://grpc.io/docs/languages/go/](https://grpc.io/docs/languages/go/)

* MapReduce: Dean, J. & Ghemawat, S. (2004). *MapReduce: Simplified Data Processing on Large Clusters*. [https://research.google.com/archive/mapreduce.html](https://research.google.com/archive/mapreduce.html)

