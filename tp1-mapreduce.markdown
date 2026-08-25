---
layout: page
title: TP1 - MapReduce
permalink: /trabajos-practicos/tp1-mapreduce/
---

# Introducción

En este trabajo práctico construirán un sistema **MapReduce** distribuido. Son dos programas: el **coordinador** y el **worker**. Habrá un solo coordinador y uno o más workers ejecutándose en paralelo. En un sistema real los workers se ejecutarían en máquinas distintas, pero acá los ejecutarán todos en una sola.

Los workers hablan con el coordinador por RPC. Cada worker le pide una tarea al coordinador en un loop, lee la entrada de uno o más archivos, ejecuta la tarea, y escribe la salida en uno o más archivos. El coordinador debe darse cuenta si un worker no terminó su tarea en un tiempo razonable (para este trabajo práctico, diez segundos) y darle esa misma tarea a otro worker.

El diseño sigue el [paper de MapReduce](http://research.google.com/archive/mapreduce-osdi04.pdf). Tengan en cuenta una diferencia de vocabulario: el paper le dice *master* a lo que acá llamamos *coordinador*.

El transporte entre el coordinador y los workers es **gRPC**. El contrato del servicio lo diseñan ustedes: definir los RPCs y los mensajes que viajan es parte del trabajo.

# Preparación del entorno

Necesitan tres cosas instaladas.

**Go 1.22 o superior.** Si no lo tienen, sigan la [documentación oficial](https://go.dev/doc/install).

**protoc y los dos plugins de Go.** Los necesitan desde el comienzo:

```sh
# macOS
brew install protobuf
# Debian / Ubuntu
sudo apt install protobuf-compiler

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

El código Go generado a partir del `.proto` **no** viene versionado en el repositorio: lo generan ustedes con `make proto`. Hasta que no lo ejecuten, el proyecto no compila. Así que esto tienen que tenerlo instalado desde el principio, no recién cuando modifiquen `mr/mrpb/mr.proto`.

**El repositorio base.** La cátedra les va a proveer un link para acceder al repositorio de este trabajo práctico. Ese repositorio lo genera y lo mantiene la cátedra, y ya viene con el código base. El trabajo debe desarrollarse y entregarse ahí: **no está permitido usar repositorios propios**. Pueden consultar los detalles en la sección [¿Cómo es la entrega de los TPs?]({{ "/faq/#cómo-es-la-entrega-de-los-tps" | relative_url }}) y en la [Política de colaboración]({{ "/faq/#política-de-colaboración" | relative_url }}) del FAQ.

Una vez que lo tengan clonado, adentro van a ver esto:

```
$ ls
README.md  src
```

Lo primero que hay que hacer, antes de compilar nada, es generar el código Go del `.proto`:

```
$ cd src
$ make proto
```

Les damos una implementación **secuencial** de MapReduce en `src/main/mrsequential.go`. Ejecuta las tareas map y reduce una por vez, en un solo proceso. También les damos un par de aplicaciones MapReduce: conteo de palabras en `mrapps/wc.go`, e indexado de texto en `mrapps/indexer.go`. Pueden ejecutar el conteo de palabras secuencial así:

```
$ cd src/main
$ go build -buildmode=plugin ../mrapps/wc.go
$ rm -f mr-out*
$ go run mrsequential.go wc.so pg-*.txt
$ sort mr-out-0 | head
A 509
ABOUT 2
ACT 8
ACTRESS 1
ACTUAL 8
ADLER 1
ADVENTURE 12
ADVENTURES 7
```

`mrsequential.go` deja su salida en `mr-out-0`. La entrada son los archivos `pg-xxx.txt`. Tómense un rato para leerlo: les va a servir de referencia, y pueden reutilizar parte de su código.

# El trabajo

El trabajo consiste en implementar un MapReduce distribuido, formado por dos programas: el coordinador y el worker. Habrá un solo coordinador y uno o más workers ejecutándose en paralelo.

El worker (o los workers) le va a pedir tareas al coordinador, va a leer la entrada de un archivo, ejecutar la tarea, y escribir la salida en un archivo. El coordinador debe darse cuenta si un worker no terminó su tarea en diez segundos, y darle esa tarea a otro worker.

Lo que tienen que escribir va en tres archivos:

| Archivo | Qué va ahí |
|---|---|
| `src/mr/mrpb/mr.proto` | El contrato gRPC: el servicio, sus RPCs y los mensajes que viajan. Viene con un RPC `Example` que está solo a modo de ejemplo. |
| `src/mr/coordinator.go` | El coordinador. |
| `src/mr/worker.go` | El worker. |

Cada vez que editen el `.proto` tienen que regenerar el código Go:

```
$ cd src
$ make proto
```

Para ejecutarlo manualmente, primero compilen una aplicación MapReduce como plugin:

```
$ cd src/main
$ go build -buildmode=plugin ../mrapps/wc.go
```

En una terminal, arranquen el coordinador:

```
$ rm -f mr-out*
$ go run mrcoordinator.go sock123 pg-*.txt
```

`sock123` es el nombre del socket Unix por el que se comunican el coordinador y los workers. Los archivos `pg-*.txt` son las entradas: cada uno es un *split*, es decir, la entrada de una tarea map.

En una o más terminales adicionales, arranquen workers:

```
$ go run mrworker.go wc.so sock123
```

Los workers y el coordinador tienen que ejecutarse desde el mismo directorio, porque `sock123` es una ruta relativa y porque los archivos intermedios se escriben ahí.

Cuando terminen, miren la salida en `mr-out-*`. Cuando el trabajo esté completo, los archivos de salida ordenados y concatenados tienen que dar lo mismo que la versión secuencial:

```
$ cat mr-out-* | sort | head
A 509
ABOUT 2
ACT 8
ACTRESS 1
ACTUAL 8
ADLER 1
ADVENTURE 12
ADVENTURES 7
```

Les damos un conjunto de tests en `src/mr/mr_test.go`. Los tests verifican que las aplicaciones `wc` e `indexer` den la salida correcta con la entrada `pg-*.txt`, que las tareas map y reduce corran en paralelo, y que la implementación se recupere de workers que se caen a mitad de una tarea.

```
$ cd src
$ make mr
```

Si ejecutan los tests sin modificar el esqueleto, no van a terminar nunca: el coordinador no finaliza, porque `Done()` devuelve `false` para siempre.

Cuando esté todo listo tienen que pasar los siete tests: `TestWc`, `TestIndexer`, `TestMapParallel`, `TestReduceParallel`, `TestJobCount`, `TestEarlyExit` y `TestCrashWorker`.

# Algunas reglas

* La fase map tiene que repartir las claves intermedias en buckets para `nReduce` tareas reduce, donde `nReduce` es la cantidad de tareas reduce: el argumento que `main/mrcoordinator.go` le pasa a `MakeCoordinator()`. Cada mapper tiene que crear `nReduce` archivos intermedios, para que después los consuman las tareas reduce.

* El worker tiene que dejar la salida de la X-ésima tarea reduce en el archivo `mr-out-X`.

* Un archivo `mr-out-X` tiene que tener una línea por cada salida de la función Reduce. La línea se genera con el formato `"%v %v"` de Go, con la clave y el valor. Miren en `main/mrsequential.go` la línea comentada con "este es el formato correcto". Los tests van a fallar si la implementación se aparta demasiado de ese formato.

* Pueden modificar `mr/worker.go`, `mr/coordinator.go` y `mr/mrpb/mr.proto` (junto con el código que se genera a partir de él). Pueden modificar otros archivos temporalmente para hacer pruebas, pero asegúrense de que su código funcione con las versiones originales: vamos a corregir con las versiones originales.

* El worker tiene que dejar la salida intermedia de Map en archivos en el directorio actual, para poder leerlos después como entrada de las tareas reduce.

* `main/mrcoordinator.go` espera que `mr/coordinator.go` implemente un método `Done()` que devuelva `true` cuando el trabajo de MapReduce haya terminado del todo; en ese momento `mrcoordinator.go` termina.

* Cuando el trabajo terminó del todo, los procesos worker tienen que terminar. Una forma simple de lograrlo es usar el error que devuelve el RPC: si el worker no consigue contactar al coordinador, puede asumir que el coordinador ya terminó porque el trabajo finalizó, así que el worker también puede terminar. Según cómo lo diseñen, quizá les resulte útil una pseudo-tarea de "terminar" que el coordinador les pueda asignar a los workers.

# Consejos

* La [página de Guidance](https://pdos.csail.mit.edu/6.824/labs/guidance.html) de MIT tiene consejos para desarrollar y depurar. Lo que más les va a servir para este trabajo práctico son las secciones sobre el race detector y sobre depuración con `printf`; las partes sobre Raft son de otro trabajo práctico.

* Una forma de empezar es modificar `Worker()` en `mr/worker.go` para que le mande un RPC al coordinador pidiendo una tarea. Después modifican el coordinador para que responda con el nombre de archivo de una tarea map todavía no empezada. Después modifican el worker para que lea ese archivo y llame a la función Map de la aplicación, como hace `mrsequential.go`.

* Las funciones Map y Reduce de la aplicación se cargan en tiempo de ejecución con el paquete `plugin` de Go, desde archivos terminados en `.so`.

* Si modifican algo en el directorio `mr/`, probablemente tengan que recompilar los plugins de MapReduce que usen, con algo como `go build -buildmode=plugin ../mrapps/wc.go`. `make mr` les compila los plugins. Pueden ejecutar un test individual con `make RUN="-run Wc" mr`, que le pasa `-run Wc` a `go test` y selecciona de `mr/mr_test.go` los tests cuyo nombre coincida con `Wc`.

* Este trabajo práctico depende de que los workers compartan un sistema de archivos. Eso es sencillo cuando todos se ejecutan en la misma máquina, pero haría falta un sistema de archivos global como GFS si se ejecutaran en máquinas distintas.

* El código de la tarea map del worker va a necesitar alguna forma de guardar los pares clave/valor intermedios en archivos, de manera que se puedan volver a leer correctamente durante las tareas reduce. Una posibilidad es usar el paquete `encoding/json` de Go. Para escribir pares clave/valor en formato JSON en un archivo abierto:

  ```go
  enc := json.NewEncoder(file)
  for _, kv := ... {
    err := enc.Encode(&kv)
  ```

  y para leer ese archivo de vuelta:

  ```go
  dec := json.NewDecoder(file)
  for {
    var kv KeyValue
    if err := dec.Decode(&kv); err != nil {
      break
    }
    kva = append(kva, kv)
  }
  ```

* Una convención razonable para los archivos intermedios es `mr-X-Y`, donde X es el número de la tarea map e Y el de la tarea reduce.

* La parte map del worker puede usar la función `ihash(key)` (está en `worker.go`) para elegir la tarea reduce de una clave dada.

* Pueden reutilizar código de `mrsequential.go` para leer los archivos de entrada de Map, para ordenar los pares clave/valor intermedios entre Map y Reduce, y para guardar la salida de Reduce en archivos.

* El coordinador, como servidor RPC, va a ser concurrente: no se olviden de proteger con locks los datos compartidos.

* Los workers a veces van a tener que esperar; por ejemplo, las tareas reduce no pueden empezar hasta que haya terminado la última tarea map. Una posibilidad es que los workers le pidan trabajo al coordinador cada tanto, durmiendo con `time.Sleep()` entre pedido y pedido. Otra es que el handler del RPC correspondiente en el coordinador tenga un loop que espere, con `time.Sleep()` o `sync.Cond`. gRPC ejecuta el handler de cada RPC en su propia goroutine, así que el hecho de que un handler esté esperando no le impide al coordinador atender otros RPCs.

* El coordinador no puede distinguir de manera confiable entre workers que se cayeron, workers que siguen vivos pero quedaron bloqueados por algún motivo, y workers que están ejecutando pero demasiado lento para ser útiles. Lo mejor que pueden hacer es que el coordinador espere un cierto tiempo, y después se dé por vencido y le reasigne la tarea a otro worker. Para este trabajo práctico, hagan que el coordinador espere **diez segundos**; pasado ese tiempo, el coordinador debería asumir que el worker falló (aunque por supuesto puede que no sea así).

* Si eligen implementar Backup Tasks (sección 3.6 del paper), tengan en cuenta que verificamos que su código no asigne tareas de más cuando los workers se ejecutan sin fallar. Las backup tasks solo se deberían asignar después de un tiempo relativamente largo (por ejemplo, 10s).

* Para probar la recuperación ante caídas pueden usar el plugin `mrapps/crash.go`. Termina el proceso en momentos aleatorios, dentro de las funciones Map y Reduce.

* Para asegurarse de que nadie observe archivos escritos a medias cuando hay caídas, el paper de MapReduce menciona la técnica de usar un archivo temporal y renombrarlo atómicamente una vez que está completamente escrito. Pueden usar `os.CreateTemp` para crear el archivo temporal y `os.Rename` para renombrarlo de forma atómica.

* El `.proto` es la única fuente de verdad del contrato: cada vez que lo editen, corran `make proto` antes de compilar, o van a estar usando los mensajes viejos. Y tengan cuidado con los tipos: los enteros de un mensaje protobuf son `int32`, no el `int` de Go, así que van a tener que convertir.

* En proto3 todos los campos tienen un valor por defecto, y un campo que quedó en cero no se distingue de uno que nunca se asignó: viajan igual. No usen el cero ni el string vacío como señal de nada. Si necesitan distinguir casos, modélenlos de forma explícita.

# Entrega

La entrega se hace en el mismo repositorio provisto por la cátedra en el que desarrollaron el trabajo. La fecha de entrega está en la página del [Calendario]({{ "/calendario/" | relative_url }}).

Este es un trabajo práctico **individual**. Antes de entregar, repasen la [Política de colaboración]({{ "/faq/#política-de-colaboración" | relative_url }}) y lo que dice el FAQ sobre [entregas tardías]({{ "/faq/#qué-pasa-si-entrego-tarde-un-tp" | relative_url }}) y [uso de IA]({{ "/faq/#uso-de-ia" | relative_url }}).
