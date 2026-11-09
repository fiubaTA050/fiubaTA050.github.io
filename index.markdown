---
layout: home
title: Bienvenidos a Sistemas Distribuidos I
---

<section class="anuncios" aria-labelledby="anuncios-heading">
  <h2 id="anuncios-heading" class="anuncios-title"><i class="fa-solid fa-bullhorn"></i> Anuncios</h2>
  <p class="anuncios-subtitle"><i class="fa-solid fa-graduation-cap"></i> Fechas de examen final</p>
  <p class="anuncios-texto">No se agregarán fechas especiales de examen ni se harán excepciones. Las fechas disponibles son:</p>
  <ul class="anuncios-fechas">
    <li><span class="anuncios-fecha">Miércoles 9 de diciembre</span> <span class="anuncios-hora">· 19:00 hs</span></li>
    <li><span class="anuncios-fecha">Viernes 18 de diciembre</span> <span class="anuncios-hora">· 19:00 hs</span></li>
    <li><span class="anuncios-fecha">Viernes 5 de febrero</span> <span class="anuncios-hora">· 19:00 hs</span></li>
    <li><span class="anuncios-fecha">Viernes 26 de febrero</span> <span class="anuncios-hora">· 19:00 hs</span></li>
    <li><span class="anuncios-fecha">Viernes 5 de marzo</span> <span class="anuncios-hora">· 19:00 hs</span></li>
  </ul>
  <p class="anuncios-texto">En todas las fechas el final será escrito y no se corregirá en el momento, sin excepción.</p>
  <p class="anuncios-subtitle"><i class="fa-solid fa-user-graduate"></i> Opción para quienes se reciben con esta materia</p>
  <p class="anuncios-texto">Quienes se reciban con esta materia pueden, si lo desean, postergar la presentación grupal del TP3. En ese caso, en lugar de presentarlo en la última semana con su ayudante, lo harán de forma presencial en la facultad, en una fecha de diciembre o en una de marzo, que definiremos más adelante.</p>
  <p class="anuncios-texto"><strong>Importante:</strong> el TP3 debe entregarse igual en la fecha límite habitual y será corregido esa misma semana. Lo único que se posterga es la presentación.</p>
  <p class="anuncios-texto">Esta opción es para quienes quieran cerrar la materia en una instancia presencial y celebrarlo con familiares y amigos. Aclaramos que, aun en este caso, el examen escrito no se corregirá en el momento.</p>
</section>

<div class="row mb-4 pb-lg-2 border-bottom border-2">

<div class="col-lg-7" markdown="1">

<h2><i class="fa-solid fa-circle-info"></i> Sistemas Distribuidos I</h2>

Este es el curso de FIUBA sobre el diseño e implementación de sistemas distribuidos modernos: cómo múltiples procesos cooperan para ofrecer servicios coherentes, escalables y tolerantes a fallos.

Se organiza en cuatro áreas. En **Compute**, cómo distribuir y paralelizar trabajo entre nodos, con MapReduce como paradigma batch. En **Storage**, filesystems distribuidos, replicación por consenso, linealizabilidad, consistencia en caches, transacciones y bases de datos globales como DynamoDB y Spanner. En **Stream Processing**, mensajería, el log como estructura unificadora y el procesamiento de flujos en tiempo real. En **Consenso descentralizado**, cómo un sistema sin autoridad central llega igual a un acuerdo, con Bitcoin como caso de estudio.

La cursada combina teoría y práctica: los trabajos prácticos reproducen técnicas reales para formar ingenieros capaces de construir y operar sistemas distribuidos a gran escala.

</div>

<div class="col-lg-5" markdown="1">

<h2><i class="fa-solid fa-chalkboard"></i> Cursada</h2>

<dl class="row course-info">
  <dt class="col-sm-5"><i class="fa-solid fa-clock"></i> Horario:</dt>
  <dd class="col-sm-7">Miércoles 19 a 22 h · Viernes 18 a 21 h</dd>

  <dt class="col-sm-5"><i class="fa-solid fa-location-dot"></i> Modalidad:</dt>
  <dd class="col-sm-7">Híbrida: la modalidad de cada clase se indica en el <a href="{{ "/calendario/" | relative_url }}">calendario</a>. El aula de las presenciales se avisa por Discord.</dd>

  <dt class="col-sm-5"><i class="fa-solid fa-link"></i> Meet:</dt>
  <dd class="col-sm-7"><a href="{{ site.course.meet }}" target="_meet" rel="noopener">Unirse a la videollamada <i class="fa-solid fa-arrow-up-right-from-square"></i></a></dd>

  <dt class="col-sm-5"><i class="fa-brands fa-youtube"></i> Grabaciones:</dt>
  <dd class="col-sm-7"><a href="{{ site.course.youtube }}" target="_yt" rel="noopener">Canal de YouTube <i class="fa-solid fa-arrow-up-right-from-square"></i></a></dd>
</dl>

<h3><i class="fa-regular fa-calendar-plus"></i> Calendario de Google</h3>

Podés [agregar el calendario de la materia a tu Google Calendar](https://calendar.google.com/calendar/u/0?cid=Y18xZTVkMDU2NmVlMTdkNGEyZDg2YWY3N2UwOThlMTIzNzc1MTUyZjY2NDNhODZmOTI4YzNiZjJlZTMxMTY0Y2I3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20) para ver las clases y recordatorios en tu propia agenda. **El calendario está disponible cuando iniciás sesión con la cuenta de Google de la facultad**.

</div>

</div>

<h2><i class="fa-solid fa-chalkboard-user"></i> Docentes</h2>

<div class="course-personnel">
  {% include docentes-section.html title="Profesor" icon="fa-solid fa-graduation-cap" people=site.data.docentes.instructor %}
  {% include docentes-section.html title="Ayudantes" icon="fa-solid fa-users" people=site.data.docentes.ayudantes %}
  {% include docentes-section.html title="Colaboradores invitados" icon="fa-solid fa-handshake" people=site.data.docentes.colaboradores_invitados %}
</div>
