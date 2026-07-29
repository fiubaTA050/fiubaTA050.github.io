---
layout: home
title: Bienvenidos a Sistemas Distribuidos I
---

<section class="anuncios" aria-labelledby="anuncios-heading">
  <h2 id="anuncios-heading" class="anuncios-title"><i class="fa-solid fa-bullhorn"></i> Anuncios</h2>
  <p class="anuncios-subtitle"><i class="fa-solid fa-graduation-cap"></i> Fechas de finales</p>
  <ul class="anuncios-fechas">
    <li><span class="anuncios-fecha">1 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 418</span></li>
    <li class="anuncios-tachada"><span class="anuncios-fecha">15 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 418</span> <span class="anuncios-reprogramada">Reprogramada al viernes 17</span></li>
    <li><span class="anuncios-fecha">17 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 313</span></li>
    <li><span class="anuncios-fecha">22 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 414</span></li>
    <li class="anuncios-tachada"><span class="anuncios-fecha">31 de julio</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 414</span> <span class="anuncios-reprogramada">Reprogramada al miércoles 5 de agosto</span></li>
    <li><span class="anuncios-fecha">5 de agosto</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 403</span></li>
    <li class="anuncios-tachada"><span class="anuncios-fecha">12 de agosto</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 414</span> <span class="anuncios-reprogramada">Reprogramada al viernes 14 de agosto por paro</span></li>
    <li><span class="anuncios-fecha">14 de agosto</span> <span class="anuncios-hora">· 19:00 hs</span> <span class="anuncios-aula">· Aula 319</span></li>
  </ul>
</section>

<div class="row mb-4 pb-lg-2 border-bottom border-2">

<div class="col-lg-7" markdown="1">

<h2><i class="fa-solid fa-circle-info"></i> Sistemas Distribuidos I</h2>

Este es el curso de FIUBA sobre el diseño e implementación de sistemas distribuidos modernos. Estudiamos cómo múltiples procesos cooperan para ofrecer servicios coherentes, escalables y tolerantes a fallos.

El curso se organiza en cuatro áreas de aplicación. En **Compute** estudiamos cómo distribuir y paralelizar trabajo entre múltiples nodos donde MapReduce y Spark se ven como paradigmas de cómputo batch y analítico, y los mecanismos que hacen posible que ese cómputo sea correcto y resiliente. En **Storage** exploramos filesystems distribuidos, transacciones, consistencia en caches, y bases de datos a escala global como Aurora y Spanner. En **Stream Processing** abordamos mensajería distribuida, el log como estructura unificadora, y el procesamiento de flujos de datos en tiempo real con garantías semánticas precisas. En **Cloud Computing** estudiamos orquestación de recursos, sistemas elásticos, cómputo serverless, y los principios de observabilidad y operabilidad que sostienen servicios en producción.

La cursada combina teoría y práctica intensiva: los trabajos prácticos reproducen técnicas reales para formar ingenieros capaces de construir y operar sistemas distribuidos robustos a gran escala.

</div>

<div class="col-lg-5" markdown="1">

<h2><i class="fa-solid fa-video"></i> Clases virtuales</h2>

<dl class="row course-info">
  <dt class="col-sm-5"><i class="fa-solid fa-calendar-days"></i> Días:</dt>
  <dd class="col-sm-7">Miércoles y Viernes</dd>

  <dt class="col-sm-5"><i class="fa-solid fa-clock"></i> Horario:</dt>
  <dd class="col-sm-7">6:00 – 9:00pm</dd>

  <dt class="col-sm-5"><i class="fa-solid fa-earth-americas"></i> Zona horaria:</dt>
  <dd class="col-sm-7">America/Argentina/Buenos_Aires</dd>

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
