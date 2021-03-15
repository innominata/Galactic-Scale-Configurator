<template>
<q-card>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Max Telluric Planets" v-model.number="params.maxTelluricNb" :rules="[ruleMaxTelluric]">
    <q-tooltip>Max of solid planets in the system in total</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.maxTelluricNb" color="blue" markers snap :min="0" :max="config.orbitRadiusArrayPlanetNb - params.maxGasGiantNb"/>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Max Gas Giants" v-model.number="params.maxGasGiantNb" :rules="[ruleMaxGasGiant]">
    <q-tooltip>Max of Gas Giants in the system in total</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.maxGasGiantNb" color="blue" markers snap :min="0" :max="config.orbitRadiusArrayPlanetNb - params.maxTelluricNb"/>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Max Telluric Moons" v-model.number="params.maxMoonTelluricNb" :rules="[ruleMaxMoonTelluric]">
    <q-tooltip>Max # of moons around solid planets in the system in total</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.maxMoonTelluricNb" color="blue" markers snap :min="0" :max="config.orbitRadiusArrayMoonsNb - params.maxMoonGasGiantNb"/>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Max Gas Giant Moons" v-model.number="params.maxMoonGasGiantNb" :rules="[ruleMaxMoonGasGiant]">
    <q-tooltip>Max # of moons around gas giants in the system in total</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.maxMoonGasGiantNb" color="blue" markers snap :min="0" :max="config.orbitRadiusArrayMoonsNb - params.maxMoonTelluricNb"/>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Jump Planetary Orbits" v-model.number="params.jumpOrbitPlanetMax" :rules="[ruleJumpOrbitPlanetMax]">
    <q-tooltip>Skip this many orbits before the first planet</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.jumpOrbitPlanetMax" color="blue" markers snap :min="0" :max="freePlanetOrbits"/>

  <q-input suffix="%" input-class="text-right" outline dense label="Chance to Jump Planetary Orbits" v-model.number="params.chanceJumpOrbitPlanets">
    <q-tooltip>Lower = denser systems, higher = further away from the star</q-tooltip>
  </q-input>

  <q-input hide-bottom-space input-class="text-right" outline dense label="Jump Moon Orbits" v-model.number="params.jumpOrbitMoonMax" :rules="[ruleJumpOrbitMoonMax]">
    <q-tooltip>Skip this many orbits before the first moon</q-tooltip>
  </q-input>
  <q-slider dense v-model="params.jumpOrbitMoonMax" color="blue" markers snap :min="0" :max="freeMoonOrbits"/>

  <q-input hide-bottom-space suffix="%" input-class="text-right" outline dense label="Chance to Jump Moon Orbits" v-model.number="params.chanceJumpOrbitMoons" >
    <q-tooltip>Lower = denser systems, higher = further away from the host planet,</q-tooltip>
  </q-input>

  <q-input hide-bottom-space suffix="%" input-class="text-right" outline dense label="Chance for Telluric Planet" v-model.number="params.chanceTelluricPlanet" >
    <q-tooltip>Chance for a telluric planet to spawn</q-tooltip>
  </q-input>

  <q-input hide-bottom-space suffix="%" input-class="text-right" outline dense label="Chance for Gas Giant" v-model.number="params.chanceGasGiant" >
    <q-tooltip>Chance for a gas giant to spawn</q-tooltip>
  </q-input>

  <q-input hide-bottom-space suffix="%" input-class="text-right" outline dense label="Chance for Telluric Moon" v-model.number="params.chanceMoonTelluric" >
    <q-tooltip>Chance for a moon around a telluric planet to spawn</q-tooltip>
  </q-input>

  <q-input hide-bottom-space suffix="%" input-class="text-right" outline dense label="Chance for Gas Giant Moon" v-model.number="params.chanceGasGiantMoon" >
    <q-tooltip>Chance for a moon around a gas giant to spawn</q-tooltip>
  </q-input>
</q-card>
</template>

<script>
export default {
  name: 'ParamComponent',
  props: ['datums', 'config'],
  data() {
    return {
      params: {}
    }
  },
  methods:{
    ruleMaxMoonGasGiant(a) {
      console.log(a > this.config.orbitRadiusArrayMoonsNb - this.params.maxMoonTelluricNb)
      if (a > this.config.orbitRadiusArrayMoonsNb - this.params.maxMoonTelluricNb) return `Value exceeds available orbits (${this.config.orbitRadiusArrayMoonsNb - this.params.maxMoonTelluricNb})`
      return true
    },
    ruleJumpOrbitMoonMax(a) {
      if (a > this.freeMoonOrbits) return `Value exceeds available orbits (${this.freeMoonOrbits})`
      return true
    },
    ruleJumpOrbitPlanetMax(a) {
      if (a > this.freePlanetOrbits) return `Value exceeds available orbits (${this.freePlanetOrbits})`
      return true
    },
    ruleMaxTelluric(a) {
      if (a > this.config.orbitRadiusArrayPlanetNb - this.params.maxGasGiantNb) return `Value exceeds available orbits (${this.config.orbitRadiusArrayPlanetNb - this.params.maxGasGiantNb})`
      return true
    },
    ruleMaxMoonTelluric(a) {
      if (a > this.config.orbitRadiusArrayMoonsNb - this.params.maxMoonGasGiantNb) return `Value exceeds available orbits (${this.config.orbitRadiusArrayMoonsNb - this.params.maxMoonGasGiantNb})`
      return true
    },
    ruleMaxGasGiant(a) {
      if (a > this.config.orbitRadiusArrayPlanetNb - this.params.maxTelluricNb) return `Value exceeds available orbits (${this.config.orbitRadiusArrayPlanetNb - this.params.maxTelluricNb})`
      return true
    },
  },
  computed:{
    freeMoonOrbits() {
      console.log(this.config.orbitRadiusArrayMoonsNb - Math.min(this.params.maxMoonTelluricNb, this.params.maxMoonGasGiantNb) - 1)
      return this.config.orbitRadiusArrayMoonsNb - Math.min(this.params.maxMoonTelluricNb, this.params.maxMoonGasGiantNb) - 1;
    },
    freePlanetOrbits() {
      return this.config.orbitRadiusArrayPlanetNb - this.params.maxTelluricNb - this.params.maxGasGiantNb;
    }
  },
  created() {
    this.params = this.datums
  },
  watch: {
    params: {
      deep:true,
      handler() {
        if (this.params.jumpOrbitMoonMax > this.freeMoonOrbits) this.params.jumpOrbitMoonMax = this.freeMoonOrbits
        if (this.params.jumpOrbitPlanetMax > this.freePlanetOrbits) this.params.jumpOrbitPlanetMax = this.freePlanetOrbits
        this.$emit('input', this.params)
      }
    },
    config: {
      deep: true,
      handler() {
        if (this.params.jumpOrbitMoonMax > this.freeMoonOrbits) this.params.jumpOrbitMoonMax = this.freeMoonOrbits
        if (this.params.jumpOrbitPlanetMax > this.freePlanetOrbits) this.params.jumpOrbitPlanetMax = this.freePlanetOrbits
      }
    }
  }
}
</script>
