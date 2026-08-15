---
layout: home
title: Bienvenidos a Sistemas Distribuidos I
---

<section class="anuncios" aria-labelledby="anuncios-heading">
  <h2 id="anuncios-heading" class="anuncios-title"><i class="fa-solid fa-bullhorn"></i> Anuncios</h2>
  <p class="anuncios-subtitle"><i class="fa-solid fa-calendar-day"></i> Primera clase</p>
  <ul class="anuncios-fechas">
    <li><span class="anuncios-fecha">Miércoles 19 de agosto</span> <span class="anuncios-hora">· 19 a 22 h</span> <span class="anuncios-aula">· Presencial en la facultad</span></li>
  </ul>
  <p class="anuncios-subtitle"><i class="fa-solid fa-envelope"></i> Alta al curso</p>
  <p class="anuncios-texto">Antes del inicio de la cursada se enviará un correo con la información para darse de alta al curso, que incluye un formulario de Google y el enlace al servidor de Discord, principal canal de comunicación de la materia. El correo se envía a la dirección registrada en SIU Guaraní.</p>
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
  <dd class="col-sm-7">Miércoles presencial, viernes virtual. El aula y las excepciones se avisan por Discord.</dd>

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
