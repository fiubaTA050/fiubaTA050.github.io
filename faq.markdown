---
layout: page
title: FAQ
permalink: /faq/
---

Respuestas a las preguntas más comunes sobre el curso, la metodología de evaluación, y otros temas de interés.

## ¿Cómo se aprueba la materia?

La materia se aprueba mediante trabajos prácticos y un coloquio final. No hay exámenes parciales.

## ¿Se toma asistencia?

En las clases presenciales en la facultad puede tomarse asistencia para registrar los presentes, pero no se exige un mínimo de presencialidad. Se recomienda fuertemente asistir a las clases, ya que en ellas se desarrollan los conceptos teóricos y se discuten aspectos prácticos relevantes para los trabajos prácticos y el coloquio.

### ¿Las clases son presenciales o virtuales?

La cursada sigue un modelo híbrido: algunas clases son presenciales en la facultad y otras, virtuales por Meet. La modalidad de cada clase se indica en la página del [Calendario]({{ "/calendario/" | relative_url }}) a medida que se confirma.

Las clases presenciales se graban y se publican después en el canal de YouTube, pero no se transmiten en vivo. Las virtuales se dan por Meet y también quedan grabadas. En ambos casos, todas las clases se disponibilizan posteriormente en la página de la materia.

El aula de las clases presenciales, y cualquier cambio de modalidad, se avisan con anticipación en el Discord de la materia.

## ¿Cómo se compone la nota final?

La nota final se compone de:

- 60% trabajos prácticos (TPs)
- 40% coloquio final

## ¿Cómo son los Trabajos Prácticos?

La materia incluye tres trabajos prácticos:

- Dos trabajos prácticos individuales
- Un trabajo práctico grupal, en grupos de tres personas

Cada trabajo práctico recibe una nota numérica. En el caso del grupal, la nota es la misma para todos los integrantes del grupo.

La nota de cursada es el promedio ponderado de las notas de los TPs (el peso de cada TP es proporcional a las semanas asignadas).

## ¿Cómo es la entrega de los TPs?

La cátedra provee un repositorio privado para cada TP (grupal o individual), y el trabajo debe desarrollarse y entregarse ahí. Los repositorios y las entregas se administran con [FIUBA Classroom](https://fiuba-tps.vercel.app), la herramienta de la cátedra, dentro de la organización de GitHub `fiubaTA050-labs`.

> No está permitido utilizar repositorios propios. Todos los trabajos deben realizarse en el repositorio provisto por la cátedra.

El flujo para cada trabajo práctico es el siguiente:

1. **Aceptar el TP.** La cátedra publica un link de invitación para cada TP en el Discord de la materia. Al abrirlo hay que iniciar sesión con la cuenta de GitHub que se va a usar durante toda la cursada, elegir el propio padrón en la lista de alumnos (se hace una sola vez por cuatrimestre y vincula la cuenta de GitHub con el padrón) y aceptar el trabajo práctico. En ese momento se crea el repositorio privado, ya con el código base, y se otorga acceso.
2. **Desarrollar en el repositorio.** Se trabaja y se hace push con normalidad. La cátedra ve los commits en su panel, pero eso **no constituye una entrega**.
3. **Confirmar la entrega.** Volviendo al mismo link de invitación, en la sección **Entrega** se indica la rama, el tag o el commit que se quiere entregar (por defecto, `main`), se completa la [declaración de uso de IA](#qué-es-la-declaración-de-uso-de-ia) y se confirma. El sistema resuelve esa referencia y congela el commit exacto: eso es lo que se corrige, aunque después se siga trabajando en el repositorio.

<figure>
  <img src="{{ "/assets/images/entrega-classroom.png" | relative_url }}" alt="Sección Entrega de FIUBA Classroom, debajo del aviso con el link al repositorio creado: muestra la fecha de entrega, el campo para indicar la rama, tag o commit a entregar, el botón Cambiar entrega y el campo de la declaración de uso de IA." loading="lazy">
  <figcaption>La sección de entrega en FIUBA Classroom, debajo del link al repositorio ya creado.</figcaption>
</figure>

Algunas aclaraciones importantes:

- **Hacer push no es entregar.** Un TP sin entrega confirmada figura para la cátedra como *Sin confirmar*, aunque el repositorio tenga commits. Hasta no confirmar la entrega, no hay entrega.
- **Se puede volver a entregar** las veces que haga falta mientras el TP esté activo. Cada confirmación queda registrada y la vigente es la última. Para volver a una versión anterior alcanza con confirmar ese commit.
- **La fecha de entrega no bloquea nada.** La fecha y hora límite (hora de Argentina) se muestran en la misma pantalla. Si se confirma después, la entrega se acepta igual, pero queda marcada como *Tarde* y aplican las reglas de [entregas tardías](#qué-pasa-si-entrego-tarde-un-tp). Lo que cuenta es el momento de la confirmación, no la fecha del commit.
- **Lo que cierra las entregas es que la cátedra desactive el TP.** A partir de ese momento no se pueden confirmar más entregas para ese trabajo práctico.

Para el TP grupal, además del código, todos los grupos realizan una exposición de aproximadamente 20 minutos el día de la entrega.

### ¿Qué es la declaración de uso de IA?

Al confirmar cada entrega hay que completar una **declaración jurada de uso de IA**. Es obligatoria: sin ella no se puede confirmar la entrega. Hay que indicar qué herramientas de IA se usaron (asistentes de código, chatbots, etc.) y para qué partes del trabajo práctico, o escribir explícitamente que no se usó ninguna.

La declaración queda guardada junto con la entrega. Si hace falta corregirla, basta con volver a confirmar la entrega, aunque sea con el mismo commit.

Declarar el uso de IA no es motivo de penalización: lo que la cátedra evalúa es que el estudiante comprenda y pueda defender el código que entrega (ver [Uso de IA](#uso-de-ia)). Omitir o falsear la declaración, en cambio, es una falta ética y tiene las consecuencias descritas en la [Política de colaboración](#política-de-colaboración).

## ¿Qué pasa si entrego tarde un TP?

Para los TPs individuales, cada alumno tiene **3 días "gratis" acumulativos** en el cuatrimestre para entregar tarde sin penalización.

Una vez agotados:

- Para entregas tardías se considerará el **50%** de la nota que hubiera sido asignada a esa entrega (la penalización aplica solo a la entrega afectada, no a todo el TP).
- Si la entrega se realiza mas de 4 días tarde, comunicar y justificar la situación a la catedra.

Para el TP grupal rige lo mismo a nivel grupo: **3 días gratis acumulativos** por grupo; luego, **50%** de descuento por cada entrega tardía.

### ¿Cuándo puedo rendir el final?

Rige el reglamento de la facultad.

- En cada período hay 5 fechas de mesa; el final puede rendirse hasta un año y medio después de aprobar la cursada (15 fechas en total).
- Cada alumno tiene **hasta 3 oportunidades** para aprobar el final.
- Agotadas las oportunidades, se debe recursar la materia. 

## ¿Cuándo se considera que abandoné la materia?

Se considera abandono (y hay que rehacer los TPs al cuatrimestre siguiente) cuando:

- Una entrega tardía supera el límite (días tarde − días gratis restantes > 4) y no se aclara con la cátedra.
- No se participa en la presentación del TP grupal sin justificación adecuada.
- Hay anomalías en la participación grupal (p. ej. muy baja participación en commits o reclamos de compañeros) sin justificación.

Además, **cualquier falta ética** (por ejemplo plagio) implica quedar libre de forma inmediata y puede escalarse a las autoridades de la universidad.

## Política de colaboración

Los trabajos prácticos individuales deben realizarse de manera individual.  
Está permitido discutir ideas y conceptos con otros estudiantes, pero no está permitido mirar ni entregar soluciones de otras personas.

Los trabajos deben desarrollarse y entregarse exclusivamente en los repositorios privados provistos por la cátedra.  
No está permitido publicar ni hacer público el código de los trabajos prácticos: todo repositorio que se utilice debe ser privado, ya que un repositorio público (por ejemplo en GitHub) puede ser accesible para estudiantes actuales o futuros de la materia.

En el trabajo grupal se espera colaboración entre los miembros del grupo asignado, pero no está permitido compartir soluciones completas entre distintos grupos.

> **Importante:**  
> Cualquier forma de plagio o conducta académica deshonesta será considerada una falta grave y podrá implicar que el estudiante quede libre en la materia, además de ser escalada a las autoridades de la facultad.

### Uso de IA
Recomendamos no utilizar herramientas de IA para generar código, ya que esto puede reducir el aprendizaje obtenido de los trabajos prácticos. Sin embargo, si decide utilizarlas, se espera que cada estudiante comprenda completamente el código que entrega, pueda explicarlo en detalle y razonar sobre su funcionamiento durante el coloquio o en instancias de evaluación. El uso de IA debe informarse en la [declaración de uso de IA](#qué-es-la-declaración-de-uso-de-ia) que se completa al confirmar cada entrega, indicando la herramienta empleada y para qué partes del trabajo se utilizó.
