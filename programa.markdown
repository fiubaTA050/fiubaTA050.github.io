---
layout: page
title: Programa
permalink: /programa/
---

## Fundamentos transversales

*Marco teórico común a todas las áreas del curso. Establece los modelos y abstracciones necesarias para razonar sobre sistemas donde las fallas parciales, la ausencia de relojes globales y la concurrencia son la norma.*

- Modelos arquitectónicos: cliente-servidor y peer-to-peer
- Modularidad y los límites de la transparencia
- Remote Procedure Call
- Semánticas de entrega
- Causalidad y tiempo
- Relojes lógicos y vectoriales
- Modelos de consistencia
- Modelos de falla
- Tolerancia a fallos
- Coordinación y consenso
- Servicios de coordinación: watches, locks distribuidos y leases
- Modelos de rendimiento: cuellos de botella y ley de Little
- Load balancing y routing

## Áreas de aplicación

*Los contenidos se organizan en cuatro áreas de aplicación que no son independientes entre sí: los mismos problemas de consenso, replicación y consistencia aparecen en todas ellas. La división busca claridad pedagógica, no fronteras rígidas.*

## Área 1 — Compute

*Cómo coordinar múltiples nodos para ejecutar trabajo de forma correcta, eficiente y tolerante a fallos, desde los paradigmas clásicos de cómputo batch hasta los límites que los vuelven insuficientes.*

- Paradigmas de cómputo distribuido
- Distribución y coordinación de tareas
- Detección y recuperación de fallos
- Cómputo batch y sus limitaciones

## Área 2 — Storage

*Persistir datos en múltiples nodos implica navegar trade-offs fundamentales entre consistencia, disponibilidad y performance. Esta área estudia cómo los sistemas reales resuelven esos trade-offs, desde filesystems hasta bases de datos globalmente distribuidas, y qué implica ofrecerlos como servicio gestionado.*

- Filesystems distribuidos
- Replicación y sharding
- Replicación por máquina de estados distribuida
- Chain replication
- Replicación sin líder: quórums parciales y hinted handoff
- Replicación y anti-entropía
- Transacciones distribuidas
- Serializabilidad y control de concurrencia por locks
- Control de concurrencia multiversión y tiempo distribuido
- Consistencia en caches
- Trade-offs entre consistencia y disponibilidad
- Elasticidad y modelo de servicio cloud
- Serverless, SLA y operabilidad de servicios a escala

## Área 3 — Stream Processing

*Muchas decisiones no pueden esperar a un procesamiento batch. Esta área estudia cómo procesar flujos de datos en tiempo real con garantías semánticas precisas, y los modelos de mensajería que hacen posible la comunicación asíncrona a escala.*

- Mensajería distribuida y el log como estructura unificadora
- Message Oriented Middleware
- Modelos de comunicación: request-reply, publisher-subscriber
- Colas de trabajo: entrega, reintentos y visibility timeout
- Diseño interno de un broker: persistencia, sharding y replicación
- Event streaming: log particionado y consumer groups
- Procesamiento de streams: tiempo de evento vs tiempo de procesamiento, watermarks, ventanas
- Modelo unificado batch y streaming
- Semántica exactly-once
- Pipelines secuenciales y paralelos

## Área 4 — Consenso descentralizado

*Todo lo anterior asume nodos que cooperan y una autoridad que decide quién manda. Esta área estudia qué queda del problema cuando se retiran ambos supuestos: cómo un sistema abierto, entre participantes que no confían entre sí, llega igual a un acuerdo sobre un único orden de eventos.*

- Sistemas sin autoridad central
- Proof of work y dificultad
- Forks, longest chain y finalidad probabilística
- Modelo UTXO frente al estado global
- Máquinas virtuales distribuidas y smart contracts