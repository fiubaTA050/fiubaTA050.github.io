---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
title: Bienvenidos a Sistemas Distribuidos I
---

Este es el curso de FIUBA sobre el diseño e implementación de sistemas distribuidos modernos. Estudiamos cómo múltiples procesos cooperan para ofrecer servicios coherentes, escalables y tolerantes a fallos.

El curso se organiza en cuatro áreas de aplicación. En **Compute** estudiamos cómo distribuir y paralelizar trabajo entre múltiples nodos donde MapReduce y Spark se ven como paradigmas de cómputo batch y analítico, y los mecanismos que hacen posible que ese cómputo sea correcto y resiliente. En **Storage** exploramos filesystems distribuidos, transacciones, consistencia en caches, y bases de datos a escala global como Aurora y Spanner. En **Stream Processing** abordamos mensajería distribuida, el log como estructura unificadora, y el procesamiento de flujos de datos en tiempo real con garantías semánticas precisas. En **Cloud Computing** estudiamos orquestación de recursos, sistemas elásticos, cómputo serverless, y los principios de observabilidad y operabilidad que sostienen servicios en producción.

La cursada combina teoría y práctica intensiva: los trabajos prácticos reproducen técnicas reales para formar ingenieros capaces de construir y operar sistemas distribuidos robustos a gran escala.

# Clases virtuales

Miércoles y Viernes · 6:00 – 9:00pm  
Zona horaria: America/Argentina/Buenos_Aires  
Información para unirse con Google Meet  
Enlace de la videollamada: [https://meet.google.com/htg-dkva-htv](https://meet.google.com/htg-dkva-htv)

## Calendario de Google

Podés [agregar el calendario de la materia a tu Google Calendar](https://calendar.google.com/calendar/u/0?cid=Y18xZTVkMDU2NmVlMTdkNGEyZDg2YWY3N2UwOThlMTIzNzc1MTUyZjY2NDNhODZmOTI4YzNiZjJlZTMxMTY0Y2I3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20) para ver las clases y recordatorios en tu propia agenda. **El calendario está disponible cuando iniciás sesión con la cuenta de Google de la facultad**.

# Docentes

{% assign docentes = site.data.docentes %}

<div class="docentes-list">
  <div class="docentes-section">
    <h3 class="docentes-section-title"><i class="fa fa-graduation-cap fa-lg"></i>Profesor</h3>
    {% for person in docentes.instructor %}
    <div class="docentes-person">
      <img class="docentes-person-img" src="{{ person.image | relative_url }}" alt="{{ person.name }}" />
      <div class="docentes-person-name">
        {% if person.url and person.url != "" %}
        <a href="{{ person.url }}">{{ person.name }}</a>
        {% else %}
        <span>{{ person.name }}</span>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="docentes-section">
    <h3 class="docentes-section-title"><i class="fa fa-users fa-lg"></i>Ayudantes</h3>
    {% for person in docentes.ayudantes %}
    <div class="docentes-person">
      <img class="docentes-person-img" src="{{ person.image | relative_url }}" alt="{{ person.name }}" />
      <div class="docentes-person-name">
        {% if person.url and person.url != "" %}
        <a href="{{ person.url }}">{{ person.name }}</a>
        {% else %}
        <span>{{ person.name }}</span>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>

  <div class="docentes-section">
    <h3 class="docentes-section-title"><i class="fa fa-handshake fa-lg"></i>Colaboradores invitados</h3>
    {% for person in docentes.colaboradores_invitados %}
    <div class="docentes-person">
      <img class="docentes-person-img" src="{{ person.image | relative_url }}" alt="{{ person.name }}" />
      <div class="docentes-person-name">
        {% if person.url and person.url != "" %}
        <a href="{{ person.url }}">{{ person.name }}</a>
        {% else %}
        <span>{{ person.name }}</span>
        {% endif %}
      </div>
    </div>
    {% endfor %}
  </div>
</div>