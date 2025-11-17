# Deck Dungeon - Documento de Diseño de Juego

## 1. Concepto General

**Título:** Deck Dungeon  
**Género:** Roguelike / Deckbuilder / Estrategia por Turnos  
**Plataforma sugerida:** PC, Web, Mobile  
**Target:** Jugadores que disfrutan estrategia profunda, rejugabilidad y construcción de sinergias  

### Descripción
Deck Dungeon es un roguelike de construcción de mazos donde avanzas por calabozos procedurales enfrentando enemigos en combates de cartas por turnos. Tras cada victoria, eliges nuevas cartas o mejoras para tu mazo, creando poderosas sinergias. Cada run es única y la muerte es permanente, pero desbloqueas contenido nuevo para futuras partidas.

---

## 2. Loop de Juego Central

### 2.1 Flujo de una Run

```
Inicio → Selección de Personaje → Mazmorra (Acto 1)
         ↓
         Elige camino en mapa
         ↓
         Encuentro (combate, evento, comerciante, etc.)
         ↓
         Recompensa (cartas, reliquias, oro)
         ↓
         Repite hasta Boss
         ↓
         Boss de Acto → Acto 2 → Acto 3 → Victoria Final
         o
         Muerte → Fin de Run → Desbloqueos → Nueva Run
```

### 2.2 Progresión de Sesión
- **Duración de run:** 45-90 minutos
- **Estructura:** 3 Actos de ~15 encuentros cada uno
- **Meta:** Derrotar al boss final del Acto 3
- **Muerte permanente:** Pierdes todo excepto desbloqueos

---

## 3. Sistema de Combate

### 3.1 Mecánicas Base

#### Energía
- Recurso principal para jugar cartas
- Empiezas con 3 energía por turno
- Se renueva completamente al inicio de tu turno
- Algunas reliquias/cartas modifican la energía máxima

#### Estructura de Turno
1. **Inicio de turno:**
   - Restaurar energía
   - Robar cartas hasta tener 5 en mano
   - Activar efectos "al inicio de turno"

2. **Fase de acción:**
   - Jugar cartas (consumiendo energía)
   - Usar pociones
   - Terminar turno cuando decidas

3. **Turno del enemigo:**
   - Intención visible (qué hará)
   - Ejecuta su acción
   - Fin del turno enemigo

4. **Repetir** hasta que alguien llegue a 0 HP

#### Sistema de Mazo
- **Mano inicial:** 5 cartas
- **Robo por turno:** Hasta tener 5 cartas
- Cuando el mazo se vacía, la pila de descarte se baraja y se convierte en el nuevo mazo
- Algunas cartas se "Exilian" (eliminan temporalmente del combate)

### 3.2 Tipos de Cartas

#### Ataques
- Causan daño directo al enemigo
- Costo de energía: 0-3
- Ejemplos:
  - **Golpe** (1 energía): 6 de daño
  - **Ataque Pesado** (2 energía): 14 de daño
  - **Golpe Doble** (1 energía): 5 de daño x2 veces

#### Habilidades
- Efectos de utilidad, defensa, o combinación
- No permanecen después del turno (excepto Bloqueo)
- Ejemplos:
  - **Defender** (1 energía): Gana 5 de Bloqueo
  - **Preparar** (1 energía): Roba 2 cartas
  - **Quemar** (1 energía): Aplica 3 de Veneno

#### Poderes
- Efectos permanentes durante todo el combate
- Se quedan en el tablero una vez jugados
- Ejemplos:
  - **Espinas** (1 energía): Cada vez que recibas daño, devuelve 3 de daño
  - **Concentración** (0 energía): +1 energía cada turno
  - **Maestría Arcana** (2 energía): Tus cartas de Ataque cuestan 1 menos

### 3.3 Estados y Efectos

#### Buffs (Positivos)
- **Fuerza:** +X de daño con Ataques
- **Destreza:** +X de Bloqueo con Habilidades
- **Energía Extra:** +X energía solo este turno
- **Regeneración:** Cura X HP al inicio de tu turno
- **Robo de Cartas:** Roba X cartas extra

#### Debuffs (Negativos)
- **Vulnerable:** Recibe 50% más daño
- **Débil:** Causa 25% menos daño
- **Fragilidad:** Pierde 25% del Bloqueo aplicado
- **Veneno:** Pierde X HP al inicio del turno (se reduce en 1 cada turno)
- **Quemadura:** Cartas no jugables que ocupan espacio en tu mano

#### Mecánicas Especiales
- **Bloqueo:** Absorbe daño. Se pierde al inicio de tu turno
- **Intangible:** El próximo daño que recibas se reduce a 1
- **Artefacto:** Niega el próximo debuff
- **Roba Vida:** Recupera HP igual a una fracción del daño causado

---

## 4. Personajes (Clases)

### 4.1 Guerrero (The Ironclad)

**Tema:** Tanque que absorbe daño y golpea fuerte

**Estadísticas Iniciales:**
- HP: 80
- Mazo inicial: 10 cartas
  - 5x Golpe (1 energía - 6 de daño)
  - 4x Defender (1 energía - 5 de Bloqueo)
  - 1x Golpe Pesado (2 energía - 14 de daño)

**Mecánicas Distintivas:**
- Acceso fácil a Bloqueo alto
- Cartas que escalan con HP faltante
- Sinergias de Fuerza
- Cartas de Exhaust (se eliminan al usarse)

**Arquetipos de Mazo:**
1. **Bloqueo Masivo:** Cartas de alta defensa + Barricada (el Bloqueo no se pierde)
2. **Golpe Pesado:** Pocas cartas poderosas + formas de reducir costos
3. **Fuerza Escalable:** Acumular +Fuerza y golpear duro

**Reliquia Inicial:** Brazalete Ardiente (+1 Fuerza al inicio de cada combate)

### 4.2 Asesino (The Silent)

**Tema:** Velocidad, Veneno, y cartas de bajo costo

**Estadísticas Iniciales:**
- HP: 70
- Mazo inicial: 10 cartas
  - 5x Golpe (1 energía - 6 de daño)
  - 5x Defender (1 energía - 5 de Bloqueo)
  - 1x Neutralizar (0 energía - 3 de daño, Aplica 1 de Débil)

**Mecánicas Distintivas:**
- Muchas cartas de 0-1 energía
- Veneno como daño over time
- Descarte de cartas para efectos
- Críticos y daño multiplicador

**Arquetipos de Mazo:**
1. **Veneno:** Apilar Veneno rápidamente y defenderse
2. **Shivs (Cuchillas):** Generar muchas cartas de 0 energía que hacen daño
3. **Descarte:** Sinergias con descartar cartas

**Reliquia Inicial:** Anillo de Serpiente (+2 cartas en turno 1)

### 4.3 Mago (The Defect)

**Tema:** Orbes elementales y gestión de recursos

**Estadísticas Iniciales:**
- HP: 75
- Mazo inicial: 10 cartas
  - 4x Golpe (1 energía - 6 de daño)
  - 4x Defender (1 energía - 5 de Bloqueo)
  - 1x Zap (1 energía - Canaliza 1 Orbe de Rayo)
  - 1x Dualcast (1 energía - Evoca tu Orbe más a la derecha 2 veces)

**Mecánicas Distintivas:**
- **Orbes:** Slots que contienen orbes elementales
  - Rayo: Causa 3-8 de daño al enemigo aleatorio al final de tu turno
  - Hielo: Da 2-5 de Bloqueo al final de tu turno
  - Oscuridad: Causa 6-12 de daño al enemigo aleatorio al evocarse
  - Plasma: +1 energía al evocarse
- **Canalizar:** Crea un Orbe
- **Evocar:** Activa el efecto del Orbe y lo elimina
- **Slots:** Empiezas con 3, algunas cartas aumentan slots

**Arquetipos de Mazo:**
1. **Rayos:** Muchos orbes de rayo + efectos de foco (+daño de orbes)
2. **Hielo:** Defensa pasiva + cartas de poder
3. **Plasma:** Generación infinita de energía

**Reliquia Inicial:** Core Agrietado (Canaliza 1 Orbe de Rayo al inicio de cada combate)

### 4.4 Clérigo (The Watcher)

**Tema:** Posturas que cambian estilo de juego, combos

**Estadísticas Iniciales:**
- HP: 72
- Mazo inicial: 10 cartas
  - 4x Golpe (1 energía - 6 de daño)
  - 4x Defender (1 energía - 5 de Bloqueo)
  - 1x Erupción (2 energía - 9 de daño)
  - 1x Vigilar (1 energía - 8 de Bloqueo, cambio a Postura Calmada)

**Mecánicas Distintivas:**
- **Posturas:**
  - Neutral: Sin efectos
  - Ira: Causas el doble de daño, recibes el doble de daño
  - Calma: Al salir de Calma, gana 2 energía
  - Divinidad: Gana 3 energía, triplica tu daño (termina al final del turno)
- **Mantras:** Acumula 10 Mantras para entrar en Divinidad
- Retener cartas entre turnos
- Sinergias de "Scrying" (mirar/manipular próximas cartas)

**Arquetipos de Mazo:**
1. **Ciclos de Postura:** Cambiar entre Ira y Calma para explosiones de energía
2. **Divinidad:** Acumular Mantras y hacer turnos devastadores
3. **Retención:** Acumular cartas poderosas para combo perfecto

**Reliquia Inicial:** Puro Agua (Al inicio de cada combate, agrega un Milagro a tu mano - 0 energía, gana 1 energía, se Exilia)

---

## 5. Estructura de Mazmorra

### 5.1 Mapa Procedural

#### Tipos de Nodos

**? Combate Normal**
- Enemigos estándar
- Recompensa: Oro + opción de carta

**E Combate Élite**
- Enemigos más difíciles (25-50% más HP/daño)
- Recompensa: Oro doble + Reliquia

**$ Comerciante**
- Compra:
  - Cartas (50-150 oro)
  - Reliquias (150-300 oro)
  - Pociones (50 oro)
- Vende: Cartas de tu mazo (50% del costo)
- Remover carta: 75 oro (aumenta 25 por cada una removida)
- Servicios especiales según el comerciante

**R Lugar de Descanso (Fogata)**
- Opción A: Descansar (Cura 30% HP máximo)
- Opción B: Mejorar una carta (aumenta sus valores, reduce costo, o agrega efecto)
- Opción C (si tienes reliquia): Forjar (mejorar reliquia)

**T Tesoro**
- Obtén una Reliquia aleatoria

**B Boss**
- Combate contra jefe de acto
- Recompensa: Reliquia única de Boss + mucho oro

**? Evento Desconocido**
- Evento narrativo con decisiones
- Riesgo/recompensa variable
- Puede ser positivo o negativo

#### Estructura del Mapa
- **Acto 1:** 15 nodos antes del boss
- **Acto 2:** 15 nodos antes del boss
- **Acto 3:** 15 nodos antes del boss final

- Siempre empiezas en la parte inferior
- Múltiples caminos disponibles
- Debes planear tu ruta:
  - ¿Muchos combates para farmear?
  - ¿Élites para reliquias?
  - ¿Fogatas para mejorar cartas?
  - ¿Eventos para sorpresas?

### 5.2 Progresión de Dificultad

**Acto 1: Fundaciones**
- Enemigos básicos
- Tiempo para construir tu mazo
- 2-3 Élites opcionales
- Boss relativamente fácil

**Acto 2: Incremento**
- Enemigos con más sinergia
- Empiezan a aparecer debuffs molestos
- Necesitas tener un plan de mazo
- Boss con múltiples fases o mecánicas

**Acto 3: Maestría**
- Enemigos brutales
- Combates largos o combates de explosión
- Tu mazo debe estar optimizado
- Boss final: El Corazón Corrupto

---

## 6. Enemigos

### 6.1 Diseño de Enemigos

#### Sistema de Intención
- Enemigos muestran su próxima acción sobre ellos:
  - ⚔️ Ataque: Cantidad de daño
  - 🛡️ Defensa: Cantidad de Bloqueo
  - 💀 Debuff: Tipo de debuff
  - 🔮 Buff: Buff que se aplicará
  - ❓ Desconocido: No se revela
  - 💤 Dormir: No hace nada

#### Filosofía de Diseño
- **Predecible pero peligroso:** El jugador siempre sabe qué viene
- **Contraplay:** Cada enemigo tiene debilidad
- **Patrones:** Comportamiento repetible
- **Escalado:** Algunos enemigos se vuelven más fuertes con el tiempo

### 6.2 Tipos de Enemigos

#### Acto 1

**Cultista**
- HP: 48-54
- Patrón: Ritual (buff), Ataque (6), Ritual, Ataque (6+3 por ritual)
- Estrategia: Matarlo rápido antes de que acumule fuerza

**Mandíbula Chasqueante**
- HP: 42-47
- Patrón: Chomp (12 daño), Thrash (7 x2), Chomp, Thrash
- Estrategia: Bloquear en turnos de Thrash

**Saqueador (Looter)**
- HP: 44-48
- Habilidad especial: Roba 1 carta de tu mano, al morir la devuelve
- Ataque: 10 daño
- Estrategia: Matar rápido o jugar cartas importantes primero

**Slime Ácido (Grande)**
- HP: 65-72
- Al morir: Se divide en 2 Slimes Ácidos (Medianos)
- Ataque: 16 daño
- Estrategia: Preparar AOE o burst para los medianos

#### Acto 2

**Centurión de Bronce**
- HP: 76
- Patrón: Atacar + ganar Artefacto (niega debuffs)
- Ataque: 12 daño
- Estrategia: Daño directo sin depender de debuffs

**Cazador de Libros (Book Hunter)**
- HP: 44
- Mecánica: Cada 3 turnos "quema" (añade Quemaduras a tu mazo)
- Ataque variable
- Estrategia: Matar antes del turno 3, 6, 9...

**Gremlin Líder + Gremlins**
- Líder HP: 140
- 3 Gremlins pequeños (HP: 10-14 cada uno)
- Los Gremlins bufan al Líder
- Estrategia: ¿Matar gremlins primero o ignorarlos?

#### Acto 3

**Darklings (x3)**
- HP: 72 cada uno
- Mecánica: Cuando uno muere, los otros se hacen más fuertes
- Ataque: 7 base (crece)
- Estrategia: Matarlos todos al mismo tiempo o burst uno

**Orbe (Orb Walker)**
- HP: 90-99
- Mecánica: Canaliza Orbes de Rayo oscuros (mucho daño)
- Estrategia: Matar rápido antes de acumular

**Reptomante**
- HP: 170-190
- Convoca serpientes pequeñas
- Aplica Vulnerable en AOE
- Estrategia: Gestionar las serpientes vs atacar al jefe

### 6.3 Jefes

#### Acto 1 (aleatorio entre 3)

**El Guardián (The Guardian)**
- HP: 240
- Fase 1: Modo defensivo (gana 9 de Bloqueo cada turno)
- Fase 2 (<50% HP): Modo ofensivo (ataca por 32)
- Mecánica: Espinas (devuelve daño)

**Slime Gigante**
- HP: 150
- Se divide en 2 Slimes Pico (75 HP cada uno)
- Los Picos se dividen en Slimes Ácidos si no mueren rápido
- Mecánica: Acumula +3 Fuerza cada 3 turnos

**Hexaghost**
- HP: 250
- Quema tu mazo constantemente
- Ataques multi-golpe
- Mecánica: Infierno (al morir, causa 6x cantidad de Quemaduras en tu mazo)

#### Acto 2 (aleatorio entre 3)

**Coleccionista (The Collector)**
- HP: 300
- Convoca minions constantemente del mazo de descarte
- Ataque moderado
- Mecánica: Mientras más minions, más fuerte

**Autómata de Bronce**
- HP: 300
- Fase 1: 50% vulnerable a Ataques, resiste Habilidades
- Fase 2 (<50% HP): Cambia, resiste Ataques, vulnerable a Habilidades
- Hiperray devastador cada 3 turnos

**Campeón Elegido (Champ)**
- HP: 406 (¡mucho!)
- Fase 1: Ataca y se bufa
- Fase 2 (<50%): Se vuelve Frágil y Vulnerable pero ataca mucho más
- Mecánica: Ejecución (si bajas de 50% HP, te mata instantáneamente)

#### Acto 3 (aleatorio entre 3)

**Autómata Despertado**
- HP: 350
- 3 Artefactos permanentes
- Spawns de 4 orbes que atacan
- Mecánica: Hyper Beam (45 x 3 daño)

**Formas y Espadas (Time Eater)** 
- HP: 420
- Mecánica única: Cada 12 cartas que juegues, gana un turno extra
- Fuerza Fuerza cada turno
- Contraplay: Jugar menos cartas pero más impactantes

**Donu y Deca (Duo)**
- Donu HP: 250
- Deca HP: 250
- Donu: Ofensivo (Fuerza)
- Deca: Defensivo (Artefactos)
- Se bufan mutuamente
- Estrategia: ¿Matar a uno primero o equilibrar?

#### Boss Final

**El Corazón Corrupto (Act 4 opcional)**
- HP: 800
- Solo accesible si completaste condiciones especiales
- Invulnerabilidad los primeros turnos
- Multiataques, debuffs, buffs
- El desafío definitivo

---

## 7. Reliquias

### 7.1 Sistema de Reliquias
- **Reliquias Comunes:** 50% drop rate
- **Reliquias Raras:** 33% drop rate
- **Reliquias de Boss:** 17% drop rate, solo de Jefes
- **Reliquias de Tienda:** Exclusivas del Comerciante
- **Reliquias de Evento:** Exclusivas de ciertos eventos

### 7.2 Ejemplos de Reliquias

#### Comunes

**Bolsa de Sangre**
- Al obtenerla: Pierde 5 HP máximos
- Efecto: Gana 2 energía en el primer turno de cada combate

**Ancla (Anchor)**
- Empiezas cada combate con 10 de Bloqueo

**Pluma Akabeko**
- Tu primera carta de Ataque cada combate causa +8 de daño

**Botella Vacía**
- Al obtenerla: Elige 1 carta de Ataque en tu mazo
- Esa carta empieza en tu mano cada combate

#### Raras

**Shuriken**
- Cada 3 cartas de Ataque jugadas en un turno: Gana 1 de Fuerza

**Kunai**
- Cada 3 cartas de Ataque jugadas en un turno: Gana 1 de Destreza

**Tótem de Momia (Mummified Hand)**
- Cuando una carta se agota (Exhaust), su costo se reduce en 1

**Corazón Congelado**
- No puedes tener oro. Gana 6 energía máxima.

#### Boss

**Fusión (Fusion Hammer)**
- Gana 1 energía al inicio de tu turno
- Ya no puedes mejorar cartas en Fogatas

**Velvet Choker**
- Gana 1 energía al inicio de tu turno
- Solo puedes jugar 6 cartas por turno

**Filosofal (Philosopher's Stone)**
- Gana 1 energía al inicio de tu turno
- Los enemigos empiezan cada combate con 1 de Fuerza

### 7.3 Sinergias de Reliquias
- Algunas reliquias trabajan juntas (Shuriken + Kunai + cartas de 0 energía)
- Otras reliquias tienen anti-sinergia (Velvet Choker en mazo con muchas cartas baratas)
- Parte de la estrategia es saber qué reliquias tomar

---

## 8. Sistema de Cartas

### 8.1 Rarezas de Cartas

**Básicas** (Starter cards)
- Golpe, Defender
- Siempre en tu mazo inicial
- Generalmente quieres removerlas eventualmente

**Comunes** (70% pool)
- Cartas simples y directas
- Forman la base de la mayoría de los mazos

**Raras** (23% pool)
- Cartas más complejas o poderosas
- Pueden definir arquetipos

**Poco Comunes** (7% pool)
- Cartas extremadamente poderosas
- Generalmente son win conditions

**Maldiciones**
- Cartas negativas que se añaden a tu mazo
- No cuestan energía pero ocupan espacio o tienen efectos negativos
- Ejemplos: Dolor (no jugable, Innata), Decadencia (pierde 1 HP al robarla)

**Estados**
- Cartas temporales añadidas durante combate
- Ejemplos: Quemadura (no jugable), Herida (no jugable, puede ser exhausted)

### 8.2 Mejora de Cartas (Upgrade)

- Se hace en Fogatas o con ciertos eventos
- Mejora PERMANENTE de la carta
- Efectos comunes:
  - Aumentar daño (+3 o +40%)
  - Reducir costo de energía (-1)
  - Añadir efecto extra
  - Aumentar número de veces que se usa
- Las cartas mejoradas tienen borde dorado y "+"

### 8.3 Construcción de Mazo Estratégico

#### Principios Clave

**Deck Delgado > Deck Grueso**
- 20-30 cartas es ideal
- Más cartas = menos consistencia
- Excepciones: Arquetipos de exhaustar, sinergias específicas

**Balance Daño/Defensa**
- ~40% Ataques
- ~35% Defensa
- ~25% Utilidad/Poderes
- Ajusta según arquetipo

**Sinergias Sobre Valor Individual**
- Una carta mediocre que se sinergiza es mejor que una buena carta solitaria
- Ejemplo: Catalizador (duplica Veneno) es meh sin Veneno, pero brutal con él

**La Curva de Energía Importa**
- Necesitas cartas de 0-1 energía para turnos malos
- Cartas de 2-3 energía para finishers
- No todas cartas deben costar 2

**Remoción de Cartas es Clave**
- Remover Golpes y Defenders básicos mejora consistencia
- Costo 75 oro, vale la pena

#### Arquetipos Comunes

**Strength Scaling (Guerrero)**
- Acumular +Fuerza constantemente
- Cartas de multi-golpe se benefician más
- Reliquias: Silla de Hierro, Vajra

**Poison (Asesino)**
- Apilar Veneno rápido (Deadly Poison, Noxious Fumes)
- Defenderse mientras el veneno hace el trabajo
- Catalizador para duplicar

**Infinite (Asesino)**
- 0 energía en todas las cartas
- Carta draw infinito
- Puede jugar todo el mazo en un turno

**Orb Scaling (Defect)**
- Muchos slots de orbes
- Focus (aumenta efectos de orbes)
- Dejar que los orbes hagan el trabajo

**Stance Dance (Watcher)**
- Cambiar entre Calma → Ira cada turno
- Explosiones de daño con energía extra de Calma
- Mental Fortress (bloqueo cada vez que cambias postura)

---

## 9. Pociones

### 9.1 Sistema de Pociones
- Máximo 5 pociones (aumentable con reliquias)
- Se usan durante combate sin costar energía
- Dropean de enemigos (~40% chance)
- Se pueden comprar en tiendas

### 9.2 Tipos de Pociones

**Poción de Fuerza**
- Gana 2 de Fuerza este combate

**Poción de Bloqueo**
- Gana 12 de Bloqueo

**Poción de Energía**
- Gana 2 energía este turno

**Poción de Fuego (Fire Potion)**
- Causa 20 de daño a todos los enemigos

**Poción Fantasma**
- Intangible por 1 turno (el próximo daño se reduce a 1)

**Poción de Cultista**
- Gana 1 Ritual (buff permanente de +3 Fuerza cada turno)

---

## 10. Eventos

### 10.1 Tipos de Eventos

#### Positivos Puros
- Ganas algo sin costo
- Ejemplo: "Encuentras un tesoro abandonado" → Oro gratis

#### Riesgo/Recompensa
- Opción de arriesgar HP/cartas por recompensa
- Ejemplo: "Altar maldito" → Opción A: Pierde 25% HP, gana reliquia | Opción B: Nada

#### Transformativos
- Cambiar tu mazo
- Ejemplo: "Biblioteca" → Puedes cambiar 2 cartas por otras 2 aleatorias

#### Narrativos
- Historia pequeña con decisiones
- Resultado variable

### 10.2 Ejemplos de Eventos

**La Serpiente Dorada (Golden Snake)**
- Opción A: Obtén 250 oro
- Opción B: Obtén reliquia rara, pero maldición

**El Match de Lucha (The Colosseum)**
- Pelea 2 combates seguidos (élites) sin descansar entre ellos
- Recompensa: Reliquia especial

**Masaje**
- Opción A: Pierde 12 HP, cura 24 HP
- Opción B: No hagas nada

**N'loth (Evento raro)**
- Ofrece reliquias especiales muy poderosas
- Costo: Remover tu reliquia más reciente

**Rueda de la Fortuna**
- Gira y obtén resultado aleatorio:
  - Gran recompensa
  - Pérdida moderada
  - Nada
  - Maldición

---

## 11. Meta-Progresión

### 11.1 Sistema de Desbloqueo

#### Cartas
- Al derrotar bosses, desbloqueas nuevas cartas para el pool
- Cada personaje tiene ~75 cartas, empiezas con ~40 desbloqueadas

#### Reliquias
- Se desbloquean con logros específicos

#### Ascensiones
- Modo de dificultad creciente (Ascensión 0-20)
- Cada nivel añade modificadores que dificultan el juego:
  - A1: Enemigos +10% HP
  - A2: Jefes aparecen 1 acto antes (Boss 1 en nodo 6 en vez de 15)
  - A5: Élites +25% HP
  - A10: Empiezas con menos HP
  - A15: Jefes aparecen 2 actos antes
  - A20: Múltiples modificadores activos

#### Logros
- 50+ logros por personaje
- Ejemplos:
  - "Minimalista": Vence el juego con un mazo de ≤20 cartas
  - "Infinity": Juega 25 cartas en un solo turno
  - "Perfecto": Vence un jefe sin perder HP

### 11.2 Sistema de Progreso del Jugador

#### Estadísticas
- Tracks de runs jugadas, victoria rate, cartas más jugadas
- Leaderboard local
- Historial de runs con estadísticas detalladas

#### Semilla Custom (Custom Seeds)
- Puedes jugar runs con semilla específica
- Útil para compartir runs o desafíos
- No cuenta para desbloqueos

---

## 12. Interfaz de Usuario

### 12.1 Menú Principal
- Jugar (selección de personaje)
- Continuar Run
- Compendio (ver todas las cartas/reliquias/enemigos)
- Estadísticas
- Opciones
- Salir

### 12.2 HUD de Combate

**Zona Central: Campo de Batalla**
- Enemigos con HP, intención, y efectos
- Tu personaje con HP, Bloqueo actual, y efectos

**Zona Inferior: Tu Mano**
- 5-10 cartas visibles
- Arrastra para jugar
- Hover para ver descripción completa

**Panel Izquierdo:**
- Pila de robo (cantidad de cartas)
- Pila de descarte (click para ver cartas)
- Pila de exilio (si hay cartas exiliadas)

**Panel Derecho:**
- Energía actual/máxima (grande y visible)
- Botón "Terminar Turno"
- Pociones (slots)

**Zona Superior:**
- Reliquias (hover para ver efecto)
- HP actual/máximo
- Oro
- Piso/Acto actual

### 12.3 Pantalla de Mapa
- Vista del acto completo
- Tu posición actual resaltada
- Caminos posibles iluminados
- Iconos claros para cada tipo de nodo
- Legends explicando cada icono

### 12.4 Pantalla de Recompensa
- Después de cada combate
- Muestra:
  - Oro ganado
  - Poción (si aplica)
  - 3 cartas para elegir (puede skip)
- Botón "Saltar recompensa" para no añadir carta

### 12.5 UX Crítico
- **Tooltips exhaustivos:** Hover sobre CUALQUIER cosa muestra info
- **Historial de combate:** Ver qué pasó en turnos previos
- **Damage Calculator:** Cálculo en tiempo real de daño con buffs/debuffs
- **Confirmaciones:** Para acciones destructivas (remover cartas, etc.)
- **Tutorial contextual:** Primera vez que ves algo nuevo, se explica

---

## 13. Arte y Sonido

### 13.1 Estilo Visual

**Dirección de Arte:**
- Estilo: Dark Fantasy con tintes de sci-fi (según el acto)
- Tono: Gótico, misterioso, épico
- Paleta:
  - Acto 1: Tonos verdes/marrones (ciudad abandonada)
  - Acto 2: Azules/morados (ciudad mecánica)
  - Acto 3: Rojos/naranjas (ciudad en llamas)

**Personajes:**
- Diseños únicos y reconocibles
- Animaciones idle y de ataque
- VFX para cada carta importante

**Cartas:**
- Ilustraciones únicas para cada carta (200+ total)
- Marco distintivo por rareza (común/raro/poco común)
- Borde dorado para mejoradas

**Enemigos:**
- Sprites animados (atacar, herido, morir)
- Intenciones con iconos claros
- Efectos de buffs/debuffs visibles

### 13.2 Sonido

**Música:**
- Tema del menú principal (épico, orquestal)
- Música de combate por acto (incremento de intensidad)
- Música de boss (tracks únicos)
- Música de victoria
- Música de derrota
- Música ambient para eventos

**SFX:**
- Jugar carta (distinto por tipo: Ataque/Habilidad/Poder)
- Daño (golpe, crítico)
- Bloqueo (shield)
- Buffs/Debuffs aplicados
- Robar cartas
- Terminar turno
- Enemigo atacando
- Morir
- Victoria
- UI clicks
- Hover de cartas
- Recolectar recompensas

---

## 14. Especificaciones Técnicas

### 14.1 Stack Tecnológico Recomendado

#### Opción 1: Unity (C#)
- **Pros:** Robusto, buen para arte 2D, fácil deployment multiplataforma
- **Contras:** Más pesado que alternativas

#### Opción 2: Godot (GDScript/C#)
- **Pros:** Ligero, open source, bueno para 2D
- **Contras:** Ecosistema más pequeño

#### Opción 3: Web (JavaScript/TypeScript)
- **Pros:** Accesible, fácil de compartir, no requiere instalación
- **Contras:** Performance, complejidad de guardado
- Frameworks: Phaser 3, PixiJS + custom game logic

### 14.2 Arquitectura del Código

```
deck-dungeon/
├── Core/
│   ├── GameManager.cs       (Estado global, run actual)
│   ├── CombatManager.cs     (Lógica de combate)
│   ├── MapManager.cs        (Generación y navegación de mapa)
│   └── SaveManager.cs       (Guardado/carga)
├── Cards/
│   ├── Card.cs              (Clase base)
│   ├── CardDatabase.cs      (Todas las cartas)
│   ├── CardEffect.cs        (Efectos de cartas)
│   └── DeckManager.cs       (Mazo del jugador)
├── Characters/
│   ├── Character.cs         (Clase base)
│   ├── Ironclad.cs
│   ├── Silent.cs
│   ├── Defect.cs
│   └── Watcher.cs
├── Enemies/
│   ├── Enemy.cs             (Clase base)
│   ├── EnemyDatabase.cs
│   ├── EnemyAI.cs           (Patrones de comportamiento)
│   └── EnemyIntent.cs       (Sistema de intenciones)
├── Relics/
│   ├── Relic.cs
│   ├── RelicDatabase.cs
│   └── RelicManager.cs
├── Events/
│   ├── Event.cs
│   ├── EventDatabase.cs
│   └── EventManager.cs
├── UI/
│   ├── MainMenu.cs
│   ├── CombatUI.cs
│   ├── MapUI.cs
│   ├── CardUI.cs
│   └── Tooltips.cs
├── Utils/
│   ├── RNG.cs               (Sistema de random seeded)
│   ├── Animation.cs
│   └── VFX.cs
└── Data/
    ├── cards.json
    ├── enemies.json
    ├── relics.json
    ├── events.json
    └── save.dat
```

### 14.3 Formato de Datos

#### Card Data (JSON)
```json
{
  "id": "strike_r",
  "name": "Golpe",
  "type": "Attack",
  "rarity": "Basic",
  "cost": 1,
  "upgraded_cost": 1,
  "description": "Causa {damage} de daño.",
  "upgraded_description": "Causa {damage} de daño.",
  "base_damage": 6,
  "upgraded_damage": 9,
  "target": "Single Enemy",
  "effects": [
    {
      "type": "Damage",
      "value": "{damage}"
    }
  ]
}
```

#### Enemy Data (JSON)
```json
{
  "id": "cultist",
  "name": "Cultista",
  "hp_range": [48, 54],
  "act": 1,
  "type": "Normal",
  "ai_pattern": [
    {
      "intent": "Buff",
      "effect": "Gain 3 Strength",
      "weight": 1
    },
    {
      "intent": "Attack",
      "damage": 6,
      "weight": 2
    }
  ],
  "relics_drop": [],
  "gold_range": [10, 20]
}
```

### 14.4 Sistema de RNG

- Usar **seeded random** para reproducibilidad
- Cada run tiene una semilla
- Permite:
  - Compartir runs exactas
  - Debugging
  - Fairness en procedural generation

```csharp
public class GameRNG {
    private System.Random rng;
    private string seed;
    
    public GameRNG(string seed) {
        this.seed = seed;
        rng = new System.Random(seed.GetHashCode());
    }
    
    public int Range(int min, int max) {
        return rng.Next(min, max);
    }
}
```

### 14.5 Sistema de Guardado

**Qué guardar:**
- Estado de run actual (si hay una en progreso)
  - Posición en mapa
  - Mazo actual
  - Reliquias
  - HP, Oro, Pociones
  - Historial de decisiones
- Progreso de desbloqueos
- Estadísticas
- Opciones

**Formato:** JSON encriptado (para evitar cheating fácil)

---

## 15. Fases de Desarrollo

### Fase 1: Prototipo de Combate (3-4 semanas)
**Objetivo:** Combate funcional y divertido

- Sistema de turnos básico
- 1 personaje (Guerrero) con 10 cartas
- 3 enemigos simples
- Energía, daño, bloqueo funcionando
- UI mínima pero funcional
- Win/lose conditions

**Milestone:** Puedes jugar un combate completo y sentir la base del gameplay

### Fase 2: Loop de Run Básico (3-4 semanas)
**Objetivo:** Un run completo jugable

- Mapa procedural simple
- 3 tipos de nodos: Combate, Élite, Boss
- Sistema de recompensas (cartas, oro)
- 1 Boss implementado
- Muerte permanente
- 20 cartas para Guerrero
- 5 reliquias básicas

**Milestone:** Puedes empezar un run y terminarlo (victoria o derrota)

### Fase 3: Contenido Expandido (4-5 semanas)
**Objetivo:** Profundidad y variedad

- 2 personajes más (Asesino, Mago)
- 40-60 cartas por personaje
- 10 enemigos variados
- 3 Bosses por acto
- Todos los tipos de nodos (Fogata, Tienda, Evento)
- 30 reliquias
- Sistema de mejora de cartas
- 10 eventos básicos

**Milestone:** Cada run se siente diferente, hay decisiones interesantes

### Fase 4: Sistemas Avanzados (3-4 semanas)
**Objetivo:** Complejidad y rejugabilidad

- 4to personaje (Clérigo)
- Mecánicas únicas de personajes completas (Orbes, Posturas)
- Acto 3 completo
- Boss final
- Sistema de pociones
- 20 reliquias adicionales
- 20 eventos adicionales
- Balanceo inicial

**Milestone:** Juego completo de inicio a fin con todos los sistemas

### Fase 5: Polish y Balance (4-6 semanas)
**Objetivo:** Calidad y balance

- Arte final de cartas (o contratar artista)
- Animaciones de enemigos
- VFX para todas las cartas importantes
- Música y SFX completos
- Balanceo extensivo (playtesting)
- Tutorial mejorado
- UI/UX refinada
- Tooltips exhaustivos
- Sistema de logros
- Estadísticas

**Milestone:** El juego se siente pulido y balanceado

### Fase 6: Meta-Progresión (2-3 semanas)
**Objetivo:** Long-term engagement

- Sistema de Ascensiones (dificultades)
- Desbloqueos progresivos
- Leaderboards
- Semillas custom
- 100+ logros
- Compendio completo

**Milestone:** Contenido para 100+ horas de juego

### Fase 7: Testing y Release (2-3 semanas)
**Objetivo:** Lanzamiento estable

- Bug fixing intensivo
- Performance optimization
- Builds multiplataforma
- Documentación
- Trailer y marketing assets
- Early access o release

**Tiempo Total Estimado:** 22-30 semanas (5.5-7.5 meses) para equipo de 2-3 personas

---

## 16. Monetización (Opcional)

### Modelo Premium
- Compra única: $15-20
- Sin microtransacciones
- Todo el contenido incluido

### Modelo Free-to-Play (No recomendado para este género)
- Juego base gratis
- Personajes desbloqueables con moneda del juego o premium
- Skins cosméticos
- **Evitar:** Pay-to-win, energy systems, loot boxes

### Modelo Early Access
- Precio reducido ($10)
- Acceso temprano al juego
- Actualizaciones regulares de contenido
- Precio completo al lanzar

### DLC (Post-Launch)
- Nuevos personajes ($5-7 cada uno)
- Nuevos actos o mazmorras
- Modos de juego alternativos
- Skins/cosméticos

---

## 17. Métricas y Analytics

### KPIs Clave
- **Win Rate por personaje:** Debería estar entre 10-25% en Ascensión 0
- **Tiempo promedio de run:** 45-90 minutos
- **Cartas más/menos jugadas:** Para balance
- **Reliquias más/menos tomadas:** Para balance
- **Tasa de abandono por acto:** ¿Dónde se rinde la gente?
- **Enemigos que causan más muertes:** Para balance
- **Combinaciones de cartas/reliquias más exitosas:** Para detectar combos rotos

### Herramientas
- Unity Analytics / Godot Analytics
- Custom telemetry system
- Guardar replays de runs para análisis
- Heatmaps de decisiones

---

## 18. Riesgos y Mitigación

### Riesgo: Desbalance de Cartas/Reliquias
- **Mitigación:** Playtesting extensivo, iteración constante, parches regulares

### Riesgo: Curva de Dificultad Incorrecta
- **Mitigación:** Ajustar números con analytics, múltiples niveles de dificultad

### Riesgo: Falta de Variedad/Rejugabilidad
- **Mitigación:** Mucho contenido procedural, eventos aleatorios, sinergias emergentes

### Riesgo: Complejidad Abrumadora para Nuevos Jugadores
- **Mitigación:** Tutorial progresivo, tooltips exhaustivos, modo fácil

### Riesgo: Bugs de Gameplay Críticos
- **Mitigación:** Testing riguroso, QA dedicado, sistema de reporte in-game

### Riesgo: Scope Creep
- **Mitigación:** Priorizar features core, post-launch content plan

---

## 19. Referencias y Competencia

### Juegos a Estudiar
- **Slay the Spire:** El gold standard, estudiar todo
- **Monster Train:** Variante con lanes
- **Inscryption:** Narrativa + deckbuilding
- **Griftlands:** Enfoque en historia
- **Nowhere Prophet:** Setting único
- **Roguebook:** Exploración en grid

### Qué Aprender de Cada Uno
- **Slay the Spire:** Balance perfecto, rejugabilidad infinita
- **Monster Train:** Innovación en mecánicas familiares
- **Inscryption:** Presentación y atmósfera
- **Griftlands:** Integración de narrativa

---

## 20. Roadmap Post-Launch

### Año 1
- **Mes 1-3:** Bug fixing, balance patches
- **Mes 4-6:** Nuevo personaje + 50 cartas
- **Mes 7-9:** Nuevo acto/modo de juego
- **Mes 10-12:** Modo Daily Run, más eventos

### Año 2
- Modo Cooperativo (?)
- Más personajes
- Expansión de historia
- Editor de mods (community content)

---

## Conclusión

Deck Dungeon es un roguelike de deckbuilding que combina profundidad estratégica con accesibilidad. La clave del éxito está en:

1. **Balance meticuloso:** Cada carta, reliquia, y enemigo debe estar balanceado
2. **Sinergias emergentes:** Los jugadores deben descubrir combos poderosos
3. **Curva de dificultad justa:** Difícil pero justo, cada muerte enseña algo
4. **Rejugabilidad:** Seed diferente, personajes diversos, desbloqueos progresivos
5. **Polish:** Feedback inmediato, tooltips claros, UX intuitivo

**Potencial Comercial:** Alto - el género tiene fanbase dedicada y hambre de nuevos títulos de calidad

**Complejidad de Desarrollo:** Alta - requiere balance extensivo y mucho contenido

**Tiempo de Desarrollo:** 6-8 meses para equipo pequeño (2-3 personas)

**Viabilidad:** Muy viable si se ejecuta bien, el género ha probado ser lucrativo
