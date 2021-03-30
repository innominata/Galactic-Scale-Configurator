<template>
  <q-page class="q-ma-sm">

    <q-card class="q-pa-sm q-mb-sm row">
      <q-toggle class="col" label="Enable Custom Star Algorithm" v-model="enableCustomStarAlgorithm" /><q-space />
      <q-file
      outlined
      v-model="file"
      accept=".cfg"
      label="Upload Config"
      style="max-width: 200px"
    />
    </q-card>
    <div v-if="enableCustomStarAlgorithm" style="background-color:#121212;" class="row">
      <q-card class="q-pa-sm col fit">
        <q-card>
          <div class="text-h6 row">
            <div>Starting System Config</div><q-space /> <q-icon name="las la-question-circle" @click="helpStartingSystemConfig = !helpStartingSystemConfig"></q-icon>
          </div>
          <div class="text-italic" v-if="helpStartingSystemConfig">The minimum number of planets for your starting system. These options override any set for the star, and one rocky planet is required to be the starting planet. The maximum number of planets/moons per system is 95</div>
          <q-input dense input-class="text-right" label="Telluric Planets" v-model.number="startingSystemMinPlanetTelluricNb">
            <q-tooltip>The number of rocky planets in the starting system </q-tooltip>
          </q-input>
          <q-slider dense v-model.number="startingSystemMinPlanetTelluricNb" color="blue" markers snap :min="1" :max="Math.min(orbitRadiusArrayPlanetNb - startingSystemMinGasGiantNb, 95 - startingSystemMinGasGiantMoonNb - startingSystemMinTelluricMoonNb - startingSystemMinGasGiantNb)"/>

          <q-input dense input-class="text-right" label="Telluric Moons" v-model.number="startingSystemMinTelluricMoonNb">
            <q-tooltip>The number of moons around rocky planets in the starting system</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="startingSystemMinTelluricMoonNb" color="blue" markers snap :min="1" :max="Math.min(orbitRadiusArrayMoonsNb - startingSystemMinGasGiantMoonNb, 95 - startingSystemMinGasGiantMoonNb - startingSystemMinPlanetTelluricNb - startingSystemMinGasGiantNb)"/>

          <q-input dense input-class="text-right" label="Gas Giants" v-model.number="startingSystemMinGasGiantNb">
            <q-tooltip>The number of gas/ice giant planets in the starting system</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="startingSystemMinGasGiantNb" color="blue" markers snap :min="0" :max="Math.min(orbitRadiusArrayPlanetNb - startingSystemMinPlanetTelluricNb, 95 - startingSystemMinGasGiantMoonNb - startingSystemMinPlanetTelluricNb - startingSystemMinTelluricMoonNb)"/>

          <q-input dense input-class="text-right" label="Gas Giant Moons" v-model.number="startingSystemMinGasGiantMoonNb">
            <q-tooltip>The number of moons around gas/ice giant planets in the starting system</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="startingSystemMinGasGiantMoonNb" color="blue" markers snap :min="0" :max="Math.min(orbitRadiusArrayMoonsNb - startingSystemMinTelluricMoonNb, 95 - startingSystemMinTelluricMoonNb - startingSystemMinPlanetTelluricNb - startingSystemMinGasGiantNb)"/>

        </q-card>
        <q-card>
          <div class="text-h6 row">
            <div>Planet Config</div><q-space /> <q-icon name="las la-question-circle" @click="helpPlanetConfig = !helpPlanetConfig"></q-icon>
          </div>
          <div class="text-italic" v-if="helpPlanetConfig">These options control how planets are generated galaxy-wide.</div>

          <q-input dense input-class="text-right" label="Maximum Orbital Inclination" v-model.number="maxOrbitInclination" suffix="°">
            <q-tooltip>Maximum absolute angle value for the Inclination of the orbits</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="maxOrbitInclination" color="blue" markers snap :min="0" :max="90"/>

          <q-input dense input-class="text-right" label="Moon Orbital Inclination Factor" v-model.number="moonOrbitInclinationFactor" suffix="x">
            <q-tooltip>If it's a moon the inclination will be multiplied by that factor</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="moonOrbitInclinationFactor" color="blue" markers :min="0" :step="0.1" :max="Math.round(900/maxOrbitInclination)/10"/>

          <q-input dense input-class="text-right" label="Neutron Star Inclination Factor" v-model.number="neutronStarOrbitInclinationFactor" suffix="x">
            <q-tooltip>If in a neutron star system the inclination will be multiplied by that factor</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="neutronStarOrbitInclinationFactor" color="blue" markers :min="0" :step="0.1" :max="Math.round(900/maxOrbitInclination)/10"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for Planet to Lay on Side" v-model.number="chancePlanetLaySide" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance of a planet to be on a rolling orbit --> laying on it's side</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chancePlanetLaySide" color="blue" markers snap :min="0" :max="100"/>

          <q-input dense input-class="text-right" label="LaySide Base Angle" v-model.number="laySideBaseAngle" suffix="°">
            <q-tooltip>Base angle Value used for the LaySide</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="laySideBaseAngle" color="blue" markers snap :min="0" :max="90"/>

          <q-input dense input-class="text-right" label="LaySide Variance" v-model.number="laySideAddingAngle" suffix="°">
            <q-tooltip>Angle Value used to add some variation on the LaySide planets</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="laySideAddingAngle" color="blue" markers snap :min="0" :max="90"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for High Axial Tilt" v-model.number="chanceBigObliquity" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for the planet to have a high obliquity value</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceBigObliquity" color="blue" markers snap :min="0" :max="100"/>

          <q-input dense input-class="text-right" label="Axial Tilt Base Angle" v-model.number="bigObliquityBaseAngle" suffix="°">
            <q-tooltip>Base Angle value to have a high obliquity value</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="bigObliquityBaseAngle" color="blue" markers snap :min="0" :max="90"/>

          <q-input dense input-class="text-right" label="Axial Tilt Variance" v-model.number="bigObliquityAddingAngle" suffix="°">
            <q-tooltip>Angle Value used to add some variation on the high Obliquity</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="bigObliquityAddingAngle" color="blue" markers snap :min="0" :max="90"/>

          <q-input dense input-class="text-right" label="Standard Tilt Angle" v-model.number="standardObliquityAngle" suffix="°">
            <q-tooltip>Base Angle value to use for the obliquity of the planets, it will be the most commonly used</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="standardObliquityAngle" color="blue" markers snap :min="0" :max="90"/>

          <q-input dense input-class="text-right" label="Rotation Period Base Time" v-model.number="rotationPeriodBaseTime" suffix="s">
            <q-tooltip>Base value to define the rotation period</q-tooltip>
          </q-input>

          <q-input dense input-class="text-right" label="Rotation Period Variance" v-model.number="rotationPeriodVariabilityFactor" suffix="s">
            <q-tooltip>Value used to add some variation ( by default : value between 0-1000 + base value = final value )</q-tooltip>
          </q-input>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for Tidal Lock" v-model.number="chanceTidalLock" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for a planet/moon to be one of the three tidally locked states.</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceTidalLock" color="blue" markers snap :min="0" :max="100"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for Tidal Lock1" v-model.number="chanceTidalLock1" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for a planet/moon to be tidally locked 1:1 with the host body</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceTidalLock1" color="blue" markers snap :min="0" :max="100"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for Tidal Lock2" v-model.number="chanceTidalLock2" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for a planet/moon to be tidally locked 1:2 with the host body</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceTidalLock2" color="blue" markers snap :min="0" :max="100"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance for Retrograde Orbit" v-model.number="chanceRetrogradeOrbit" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for a planet to have a retrograde orbit</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceRetrogradeOrbit" color="blue" markers snap :min="0" :max="100"/>

          <q-input dense input-class="text-right" label="Habitable Radius Area Baseline" suffix="AU" v-model.number="habitableRadiusAreaBaseline">
            <q-tooltip>Value to define the width of the habitability area of a star : star.habitableRadius + / - HabitableRadiusAreaBaseline --> meaning for a value of 0.2AU the area is 0.4AU wide</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="habitableRadiusAreaBaseline" color="blue" markers :step="0.1" :min="0" :max="useCustomOrbitRadiusArrayPlanets?customOrbitRadiusArrayPlanets[customOrbitRadiusArrayPlanets.length -1].value/2:30"/>

          <q-input hide-bottom-space dense input-class="text-right" label="Chance Being Habitable" v-model.number="chanceBeingHabitable" suffix="%" :rules="[rule100]">
            <q-tooltip>Chance for a planet in the habitability zone of a star to actually be habitable</q-tooltip>
          </q-input>
          <q-slider dense v-model.number="chanceBeingHabitable" color="blue" markers snap :min="0" :max="100"/>

          <q-input dense input-class="text-right" label="Volcano Planet Distance Ratio" v-model.number="volcanoPlanetDistanceRatio" suffix="x">
            <q-tooltip>If planet.distance / star.habitableRadius is less than that --> the planet will be a volcano planet</q-tooltip>
          </q-input>

          <q-input dense input-class="text-right" label="Ice Planet Distance Ratio" v-model.number="icePlanetDistanceRatio" suffix="x">
            <q-tooltip>If planet.distance / star.habitableRadius is more than that --> the planet will be an ice planet</q-tooltip>
          </q-input>

        </q-card>
      </q-card>
      <q-card class="q-ml-sm q-pa-sm col fit"> <!-- Custom Parameters for Stars -->
        <div class="text-h6 row">
          <div>Star Config</div><q-space /> <q-icon name="las la-question-circle" @click="helpStarConfig = !helpStarConfig"></q-icon>

        </div>
        <div class="text-italic" v-if="helpStarConfig">These options control how star systems are created.</div>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Black Holes" v-model="useCustomParamsForBlackHole" />
          <starparams v-if="useCustomParamsForBlackHole" :datums="customParamsForBlackHole" :config="config" @input="(input) => customParamsForBlackHole = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Neutron Stars" v-model="useCustomParamsForNeutronStar" />
          <starparams v-if="useCustomParamsForNeutronStar" :datums="customParamsForNeutronStar" :config="config" @input="(input) => customParamsForNeutronStar = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for White Dwarves" v-model="useCustomParamsForWhiteDwarf" />
          <starparams v-if="useCustomParamsForWhiteDwarf" :datums="customParamsForWhiteDwarf" :config="config" @input="(input) => customParamsForWhiteDwarf = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Giant Stars" v-model="useCustomParamsForGiantStar" />
        <starparams v-if="useCustomParamsForGiantStar" :datums="customParamsForGiantStar" :config="config" @input="(input) => customParamsForGiantStar = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class A Stars" v-model="useCustomParamsForClassA" />
        <starparams v-if="useCustomParamsForClassA" :datums="customParamsForClassA" :config="config" @input="(input) => customParamsForClassA = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class B Stars" v-model="useCustomParamsForClassB" />
        <starparams v-if="useCustomParamsForClassB" :datums="customParamsForClassB" :config="config" @input="(input) => customParamsForClassB = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class F Stars" v-model="useCustomParamsForClassF" />
        <starparams v-if="useCustomParamsForClassF" :datums="customParamsForClassF" :config="config" @input="(input) => customParamsForClassF = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class G Stars" v-model="useCustomParamsForClassG" />
        <starparams v-if="useCustomParamsForClassG" :datums="customParamsForClassG" :config="config" @input="(input) => customParamsForClassG = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class K Stars" v-model="useCustomParamsForClassK" />
        <starparams v-if="useCustomParamsForClassK" :datums="customParamsForClassK" :config="config" @input="(input) => customParamsForClassK = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class M Stars" v-model="useCustomParamsForClassM" />
        <starparams v-if="useCustomParamsForClassM" :datums="customParamsForClassM" :config="config" @input="(input) => customParamsForClassM = input"></starparams>
        </q-card>
        <q-card class="q-ma-sm">
          <q-toggle dense label="Use Custom Parameters for Class O Stars" v-model="useCustomParamsForClassO" />
        <starparams v-if="useCustomParamsForClassO" :datums="customParamsForClassO" :config="config" @input="(input) => customParamsForClassO = input"></starparams>
        </q-card>
      </q-card>

      <q-card class="q-ml-sm q-pa-sm row col fit">
        <q-card class="col items-start ">
          <div class="text-h6 row">
            <div>Planet Orbits</div><q-space /> <q-icon name="las la-question-circle" @click="helpPlanetOrbits = !helpPlanetOrbits"></q-icon>
          </div>
          <div class="text-italic" v-if="helpPlanetOrbits">These options control where planets are placed around stars. This governs how many planets you may have in total. The last orbit shouldn't be greater than 65AU</div>
          <q-toggle dense label="Use Custom Orbits for Planets" v-model="useCustomOrbitRadiusArrayPlanets"/>
          <div v-if="useCustomOrbitRadiusArrayPlanets">
            <div v-for="(item, q) in orbitRadiusArrayPlanets" :key="q">
              <q-input dense input-class="text-right" suffix="AU" outline label="Orbital Radius" v-model.number="item.value">
                 <template v-slot:append>
                  <q-btn icon="delete" class="text-red" @click="orbitRadiusArrayPlanets.splice(q,1)"/>
                </template>
              </q-input>
            </div>
          </div>
          <q-btn class="row col" dense outline v-if="useCustomOrbitRadiusArrayPlanets" label="Add New Orbit" @click="addPlanetOrbit"/>
        </q-card>

        <q-card class="col items-start ">
          <div class="text-h6 row">
            <div>Moon Orbits</div><q-space /> <q-icon name="las la-question-circle" @click="helpMoonOrbits = !helpMoonOrbits"></q-icon>
          </div>
          <div class="text-italic" v-if="helpMoonOrbits">These options control where moons are placed around planets. This governs how many moons can be placed around a planet.</div>
          <q-toggle dense label="Use Custom Orbits for Moons" v-model="useCustomOrbitRadiusArrayMoons" />
          <div v-if="useCustomOrbitRadiusArrayMoons">
            <div v-for="(item, q) in orbitRadiusArrayMoons" :key="q">
              <q-input dense input-class="text-right" suffix="AU" outline label="Orbital Radius" v-model.number="item.value">
                 <template v-slot:append>
                  <q-btn icon="delete" class="text-red" @click="orbitRadiusArrayMoons.splice(q,1)"/>
                </template>
              </q-input>
            </div>
          </div>
          <q-btn dense outline v-if="useCustomOrbitRadiusArrayMoons" label="Add New Orbit" @click="addMoonOrbit"/>
        </q-card>
      </q-card>
    </div>
    <q-card class="q-mt-sm q-pa-sm">
      <q-btn :color="preview?'blue':'white'" outline @click="preview = !preview">Preview</q-btn>
      <q-btn class="q-ml-md" outline @click="download">Download</q-btn>
      <highlightjs language='c#' :code="output" v-if="preview"/>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'SysGen',
  data() {
    return {
      helpMoonOrbits: false,
      helpPlanetOrbits: false,
      helpStarConfig: false,
      helpStartingSystemConfig: false,
      helpPlanetConfig: false,
      file: null,
      aOptions: [],
      input: '',
      inputArray:[],
      parsedArray: [],
      preview:false,
      enableCustomStarAlgorithm: true,
      orbitRadiusArrayMoons: [{ value:0.050 },{ value:0.063 },{ value:0.075 },{ value:0.088 },{ value:0.100 },{ value:0.113 },{ value:0.125 },{ value:0.138 },{ value:0.150 },{ value:0.163 },{ value:0.175 },{ value:0.188 },{ value:0.200 },{ value:0.213 },{ value:0.225 },{ value:0.238 },{ value:0.250 },{ value:0.263 },{ value:0.275 },{ value:0.288 },{ value:0.300 },{ value:0.313 },{ value:0.325 },{ value:0.338 },{ value:0.350 },{ value:0.363 },{ value:0.375 },{ value:0.388 },{ value:0.400 },{ value:0.413 },{ value:0.425 },{ value:0.438 },{ value:0.450 },{ value:0.463 },{ value:0.475 },{ value:0.488 },{ value:0.500 },{ value:0.513 },{ value:0.525 },{ value:0.538 },{ value:0.550 },{ value:0.563 },{ value:0.575 },{ value:0.588 },{ value:0.600 },{ value:0.613 },{ value:0.625 },{ value:0.638 },{ value:0.650 },{ value:0.663 }],
      orbitRadiusArrayPlanets: [{ value:0.5 },{ value:0.7 },{ value:0.9 },{ value:1.1 },{ value:1.3 },{ value:1.5 },{ value:1.7 },{ value:1.9 },{ value:2.1 },{ value:2.4 },{ value:2.7 },{ value:3.0 },{ value:3.3 },{ value:3.6 },{ value:3.9 },{ value:4.2 },{ value:4.5 },{ value:4.8 },{ value:5.1 },{ value:5.4 },{ value:5.7 },{ value:6.0 },{ value:6.4 },{ value:6.8 },{ value:7.2 },{ value:7.6 },{ value:8.0 },{ value:8.4 },{ value:8.8 },{ value:9.2 },{ value:9.6 },{ value:10.0 },{ value:10.5 },{ value:11.0 },{ value:11.5 },{ value:12.0 },{ value:12.5 },{ value:13.0 },{ value:13.5 },{ value:14.0 },{ value:14.6 },{ value:15.2 },{ value:15.8 },{ value:16.4 },{ value:17.0 },{ value:17.6 },{ value:18.2 },{ value:18.9 },{ value:19.6 },{ value:20.3 },{ value:21.0 },{ value:21.7 },{ value:22.4 },{ value:23.2 },{ value:24.0 },{ value:24.8 },{ value:25.6 },{ value:26.4 },{ value:27.3 },{ value:28.2 },{ value:29.1 },{ value:30.0 },{ value:31.0 },{ value:32.0 },{ value:33.0 },{ value:34.0 },{ value:35.1 },{ value:36.2 },{ value:37.3 },{ value:38.4 },{ value:39.6 },{ value:40.8 },{ value:42.0 },{ value:43.3 },{ value:44.6 },{ value:45.9 },{ value:47.2 },{ value:48.6 },{ value:50.0 },{ value:51.5 },{ value:53.0 },{ value:54.5 },{ value:56.1 },{ value:57.7 },{ value:59.3 },{ value:61.0 },{ value:62.7 },{ value:64.5 },{ value:66.3 },{ value:68.2 }],
      useCustomOrbitRadiusArrayPlanets: true,
      useCustomOrbitRadiusArrayMoons: true,
      useCustomParamsForBlackHole: false,
      customParamsForBlackHole: "1,0,2,0,10,0.95,2,0.9,0.5,0.5,0.5,0.5",
      useCustomParamsForNeutronStar: false,
      customParamsForNeutronStar: "2,1,4,6,8,0.85,2,0.1,0.8,0.2,0.5,0.5",
      useCustomParamsForWhiteDwarf: false,
      customParamsForWhiteDwarf: "3,1,6,6,6,0.8,3,0.5,0.6,0.6,0.7,0.2",
      useCustomParamsForGiantStar: false,
      customParamsForGiantStar: "4,1,8,6,6,0.8,3,0.8,0.6,0.6,0.7,0.2",
      useCustomParamsForClassA: false,
      customParamsForClassA: "8,3,16,12,3,0.3,3,0.4,0.7,0.4,0.6,0.5",
      useCustomParamsForClassB: false,
      customParamsForClassB: "9,4,18,16,5,0.5,2,0.6,0.8,0.5,0.8,0.5",
      useCustomParamsForClassF: false,
      customParamsForClassF: "7,2,14,8,3,0.6,2,0.4,0.8,0.7,0.8,0.2",
      useCustomParamsForClassG: false,
      customParamsForClassG: "6,2,12,8,3,0.8,2,0.6,0.8,0.6,0.7,0.3",
      useCustomParamsForClassK: false,
      customParamsForClassK: "4,4,8,8,2,0.5,2,0.5,0.8,0.8,0.8,0.2",
      useCustomParamsForClassM: false,
      customParamsForClassM: "6,4,12,16,1,0.7,2,0.2,0.7,0.8,0.6,0.3",
      useCustomParamsForClassO: false,
      customParamsForClassO: "10,4,20,16,4,0.2,2,0.2,0.9,0.5,0.9,0.8",
      // useCustomParamsForClassX: false
      // CustomParamsForClassX: 0,0,0,0,0,0.,0,0.,0.,0.,0.,0.
      startingSystemMinPlanetTelluricNb: 8,
      startingSystemMinGasGiantNb: 3,
      startingSystemMinTelluricMoonNb: 16,
      startingSystemMinGasGiantMoonNb: 12,
      maxOrbitInclination: 35,
      moonOrbitInclinationFactor: 2.2,
      neutronStarOrbitInclinationFactor: 1.3,
      chancePlanetLaySide: 0.04,
      laySideBaseAngle: 20,
      laySideAddingAngle: 70,
      chanceBigObliquity: 0.1,
      bigObliquityBaseAngle: 40,
      bigObliquityAddingAngle: 30,
      standardObliquityAngle: 30,
      rotationPeriodBaseTime: 400,
      rotationPeriodVariabilityFactor: 1000,
      chanceTidalLock: 0.1,
      chanceTidalLock1: 0.04,
      chanceTidalLock2: 0.07,
      chanceRetrogradeOrbit: 0.05,
      habitabilityBaseConstant: 1000,
      habitableRadiusAreaBaseline: 0.2,
      chanceBeingHabitable: 0.4,
      volcanoPlanetDistanceRatio: 0.3,
      icePlanetDistanceRatio: 1.2
    }
  },
  watch: {
    file() {
      this.loadFile(this.file);
    },
    startingSystemMinGasGiantMoonNb() {
      if (this.startingSystemMinGasGiantNb == 0 && this.startingSystemMinGasGiantMoonNb > 0 && (this.orbitRadiusArrayPlanetNb - this.startingSystemMinPlanetTelluricNb) > 0)
        this.startingSystemMinGasGiantNb = 1;
    },
    startingSystemMinGasGiantNb() {
      if (this.startingSystemMinGasGiantNb == 0) this.startingSystemMinGasGiantMoonNb = 0;
    },
  },
  created() {
      let defaultConfig = `
[galactic-scale-systems]
EnableCustomStarAlgorithm = true
OrbitRadiusArrayMoonsNb = 20
OrbitRadiusArrayPlanetNb = 17
UseCustomOrbitRadiusArrayPlanets = false
UseCustomOrbitRadiusArrayMoons = false
CustomOrbitRadiusArrayPlanets = 0,0.3,0.7,1.1,1.5,1.9,2.3,3.5,5.3,7.7,10.8,14.7,19.5,25.3,32.2,40.3,49.7,60.5
CustomOrbitRadiusArrayMoon = 0.048125,0.06015625,0.0751953125,0.09399414063,0.1174926758,0.1468658447,0.1835823059,0.2294778824,0.286847353,0.3585591912,0.448198989,0.5602487363,0.7003109204,0.8753886505,1.094235813,1.367794766,1.709743458,2.137179322,2.671474153,3.339342691,4.174178364
UseCustomParamsForBlackHole = false
CustomParamsForBlackHole = 1,0,6,0,4,0.9,2,0.9,0.5,0.5,0.5,0.5
UseCustomParamsForNeutronStar = false
CustomParamsForNeutronStar = 1,1,1,1,4,0.1,2,0.1,0.8,0.2,0.5,0.5
UseCustomParamsForWhiteDwarf = false
CustomParamsForWhiteDwarf = 2,1,1,3,3,0.5,3,0.5,0.6,0.6,0.7,0.2
UseCustomParamsForGiantStar = false
CustomParamsForGiantStar = 2,2,1,6,3,0.8,3,0.8,0.6,0.6,0.7,0.2
UseCustomParamsForClassA = false
CustomParamsForClassA = 5,4,4,8,3,0.3,3,0.4,0.7,0.4,0.6,0.5
UseCustomParamsForClassB = false
CustomParamsForClassB = 5,2,5,2,5,0.5,2,0.6,0.8,0.5,0.8,0.5
UseCustomParamsForClassF = false
CustomParamsForClassF = 4,3,2,4,3,0.6,2,0.4,0.8,0.7,0.8,0.2
UseCustomParamsForClassG = false
CustomParamsForClassG = 3,3,1,2,3,0.8,2,0.6,0.8,0.6,0.7,0.3
UseCustomParamsForClassK = false
CustomParamsForClassK = 4,3,1,4,2,0.5,2,0.5,0.8,0.8,0.8,0.2
UseCustomParamsForClassM = false
CustomParamsForClassM = 1,4,1,11,1,0.7,2,0.2,0.7,0.8,0.6,0.3
UseCustomParamsForClassO = false
CustomParamsForClassO = 7,3,6,8,4,0.2,2,0.2,0.9,0.5,0.9,0.8
StartingSystemMinPlanetTelluricNb = 2
StartingSystemMinGasGiantNb = 1
StartingSystemMinTelluricMoonNb = 1
StartingSystemMinGasGiantMoonNb = 1
MaxOrbitInclination = 35
MoonOrbitInclinationFactor = 2.2
NeutronStarOrbitInclinationFactor = 1.3
ChancePlanetLaySide = 0.04
LaySideBaseAngle = 20
LaySideAddingAngle = 70
ChanceBigObliquity = 0.1
BigObliquityBaseAngle = 40
BigObliquityAddingAngle = 30
StandardObliquityAngle = 30
RotationPeriodBaseTime = 400
RotationPeriodVariabilityFactor = 1000
ChanceTidalLock = 0.1
ChanceTidalLock1 = 0.04
ChanceTidalLock2 = 0.07
ChanceRetrogradeOrbit = 0.05
HabitabilityBaseConstant = 1000
HabitableRadiusAreaBaseline = 0.2
ChanceBeingHabitable = 0.4
VolcanoPlanetDistanceRatio = 0.3
IcePlanetDistanceRatio = 1.2`
      this.parseFile(defaultConfig)
      // this.customParamsForBlackHole = this.setParams("1,0,2,0,10,0.95,2,0.9,0.5,0.5,0.5,0.5")
      // this.customParamsForNeutronStar = this.setParams("2,1,4,6,8,0.85,2,0.1,0.8,0.2,0.5,0.5")
      // this.customParamsForWhiteDwarf = this.setParams("3,1,6,6,6,0.8,3,0.5,0.6,0.6,0.7,0.2")
      // this.customParamsForGiantStar = this.setParams("4,1,8,6,6,0.8,3,0.8,0.6,0.6,0.7,0.2")
      // this.customParamsForClassA = this.setParams("8,3,16,12,3,0.3,3,0.4,0.7,0.4,0.6,0.5")
      // this.customParamsForClassB = this.setParams("9,4,18,16,5,0.5,2,0.6,0.8,0.5,0.8,0.5")
      // this.customParamsForClassF = this.setParams("7,2,14,8,3,0.6,2,0.4,0.8,0.7,0.8,0.2")
      // this.customParamsForClassG = this.setParams("6,2,12,8,3,0.8,2,0.6,0.8,0.6,0.7,0.3")
      // this.customParamsForClassK = this.setParams("4,4,8,8,2,0.5,2,0.5,0.8,0.8,0.8,0.2")
      // this.customParamsForClassM = this.setParams("6,4,12,16,1,0.7,2,0.2,0.7,0.8,0.6,0.3")
      // this.customParamsForClassO = this.setParams("10,4,20,16,4,0.2,2,0.2,0.9,0.5,0.9,0.8")

      // this.chancePlanetLaySide = 4
      // this.chanceBigObliquity = 10
      // this.chanceTidalLock = 10
      // this.chanceTidalLock1 = 4
      // this.chanceTidalLock2 = 7
      // this.chanceRetrogradeOrbit = 5
      // this.chanceBeingHabitable = 40

  },
  methods: {
    round10(n) {
      return Math.round(n*10)/10;
    },
    round100(n) {
      return Math.round(n*100)/100;
    },
    addPlanetOrbit() {
      let v0 = Number(this.orbitRadiusArrayPlanets[this.orbitRadiusArrayPlanets.length -1].value);
      let v1 = 0
      if (this.orbitRadiusArrayPlanets.length > 1) v1 = Number(this.orbitRadiusArrayPlanets[this.orbitRadiusArrayPlanets.length -2].value)
      let v = v0 + (v0 - v1)
      this.orbitRadiusArrayPlanets.push({value:this.round100(v)})
    },
    addMoonOrbit() {
      let v0 = Number(this.orbitRadiusArrayMoons[this.orbitRadiusArrayMoons.length -1].value);
      let v1 = 0
      if (this.orbitRadiusArrayMoons.length > 1) v1 = Number(this.orbitRadiusArrayMoons[this.orbitRadiusArrayMoons.length -2].value)
      let v = v0 + (v0 - v1)
      this.orbitRadiusArrayMoons.push({value:this.round100(v)})

    },
    rule100(a) {
      if (a > 100) return 'Value exceeds 100%'
      return true
    },
    updateOptions(options) {
      // console.log(options);
      this.aOptions = options
      for(var i in options){
        let value = options[i];
        if (value === 'true') options[i] = true;
        if (value === 'false') options[i] = false;
      }
      // console.log(options);
      let orap = options.customOrbitRadiusArrayPlanets.split(',');
      orap.shift();
      let oram = options.customOrbitRadiusArrayMoon.split(',');
      let orax = oram.map((value) => { return {value: value}});
      orap.forEach((item, i) => {
        orap[i] = { value: item };
      });
      oram.forEach((item,i) => {
        oram[i] = { value: item };
      });
      // console.log(oram, orax);
      this.orbitRadiusArrayMoons = oram;
      this.orbitRadiusArrayPlanets = orap;
      this.enableCustomStarAlgorithm = options.enableCustomStarAlgorithm;
      this.useCustomOrbitRadiusArrayPlanets = options.useCustomOrbitRadiusArrayPlanets;
      this.useCustomOrbitRadiusArrayMoons = options.useCustomOrbitRadiusArrayMoons;
      this.useCustomParamsForBlackHole = options.useCustomParamsForBlackHole;
      this.useCustomParamsForNeutronStar = options.useCustomParamsForNeutronStar;
      this.useCustomParamsForWhiteDwarf = options.useCustomParamsForWhiteDwarf;
      this.useCustomParamsForGiantStar = options.useCustomParamsForGiantStar;
      this.useCustomParamsForClassA = options.useCustomParamsForClassA;
      this.useCustomParamsForClassB = options.useCustomParamsForClassB;
      this.useCustomParamsForClassF = options.useCustomParamsForClassF;
      this.useCustomParamsForClassG = options.useCustomParamsForClassG;
      this.useCustomParamsForClassK = options.useCustomParamsForClassK;
      this.useCustomParamsForClassM = options.useCustomParamsForClassM;
      this.useCustomParamsForClassO = options.useCustomParamsForClassO;
      this.customParamsForNeutronStar = this.setParams(options.customParamsForNeutronStar);
      this.customParamsForBlackHole = this.setParams(options.customParamsForBlackHole);
      this.customParamsForGiantStar = this.setParams(options.customParamsForGiantStar);
      this.customParamsForWhiteDwarf = this.setParams(options.customParamsForWhiteDwarf);
      this.customParamsForClassB = this.setParams(options.customParamsForClassB);
      this.customParamsForClassA = this.setParams(options.customParamsForClassA);
      this.customParamsForClassG = this.setParams(options.customParamsForClassG);
      this.customParamsForClassF = this.setParams(options.customParamsForClassF);
      this.customParamsForClassO = this.setParams(options.customParamsForClassO);
      this.customParamsForClassM = this.setParams(options.customParamsForClassM);
      this.customParamsForClassK = this.setParams(options.customParamsForClassK);
      this.startingSystemMinPlanetTelluricNb = parseInt(options.startingSystemMinPlanetTelluricNb);
      this.startingSystemMinGasGiantNb = parseInt(options.startingSystemMinGasGiantNb);
      this.startingSystemMinTelluricMoonNb = parseInt(options.startingSystemMinTelluricMoonNb);
      this.startingSystemMinGasGiantMoonNb = parseInt(options.startingSystemMinGasGiantMoonNb);
      this.maxOrbitInclination = parseInt(options.maxOrbitInclination);
      this.moonOrbitInclinationFactor = parseFloat(options.moonOrbitInclinationFactor);
      this.neutronStarOrbitInclinationFactor = parseFloat(options.neutronStarOrbitInclinationFactor);
      this.chancePlanetLaySide = parseInt(100 * parseFloat(options.chancePlanetLaySide));
      this.laySideBaseAngle = parseInt(options.laySideBaseAngle);
      this.laySideAddingAngle = parseInt(options.laySideAddingAngle);
      this.chanceBigObliquity = parseInt(100 * parseFloat(options.chanceBigObliquity));
      this.bigObliquityBaseAngle = parseInt(options.bigObliquityBaseAngle);
      this.bigObliquityAddingAngle = parseInt(options.bigObliquityAddingAngle);
      this.standardObliquityAngle = parseInt(options.standardObliquityAngle);
      this.rotationPeriodBaseTime = parseInt(options.rotationPeriodBaseTime);
      this.rotationPeriodVariabilityFactor = parseInt(options.rotationPeriodVariabilityFactor);
      this.chanceTidalLock = parseInt(100 * parseFloat(options.chanceTidalLock));
      this.chanceTidalLock1 = parseInt(100 * parseFloat(options.chanceTidalLock1));
      this.chanceTidalLock2 = parseInt(100 * parseFloat(options.chanceTidalLock2));
      this.chanceRetrogradeOrbit = parseInt(100 * Number(options.chanceRetrogradeOrbit));
      this.habitabilityBaseConstant = parseInt(options.habitabilityBaseConstant);
      this.habitableRadiusAreaBaseline = Number(options.habitableRadiusAreaBaseline);
      this.chanceBeingHabitable = parseInt(100 * Number(options.chanceBeingHabitable));
      this.volcanoPlanetDistanceRatio = Number(options.volcanoPlanetDistanceRatio);
      this.icePlanetDistanceRatio = Number(options.icePlanetDistanceRatio);
    },
    loadFile(file) {
      const reader = new FileReader();
      reader.onload = () => { this.parseFile(reader.result)};
      reader.readAsText(file);
    },
    parseFile(a) {
      let die = false;
      this.input = a;
      this.inputArray = a.split("\n");
      let prunedArray = [];
      this.inputArray.forEach((line) => {
        line = line.trim();
        let l = line.trim().substr(0,1);
        if (l === '[') if (line != '[galactic-scale-systems]') {
          alert('This doesn\'t seem to be a valid Star System Generation Config');
          this.input = '';
          die = true;
          return false;
        }
        if (l != '#' && l != ' ' && l != '' && l != '[') prunedArray.push(line);
      });
      if (die) return;
      this.inputArray = prunedArray;
      let options = {};
      this.inputArray.forEach((line) => {
        const explodedLine = line.split(' ');
        let key = explodedLine[0];
        const val = explodedLine[2];
        key = key[0].toLowerCase() + key.substr(1,key.length-1);
        options[key] = val;
      });
      this.updateOptions(options);

    },
    download () {
      const blob = new Blob([this.output], { type: 'text/plain' })
      const a = document.createElement('a')
      a.download = 'dsp.galactic-scale.star-system-generation.cfg'
      a.href = URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 1500)
    },
    getParams(a) {
      let b = []
      b.push(a.maxTelluricNb)
      b.push(a.maxGasGiantNb)
      b.push(a.maxMoonTelluricNb)
      b.push(a.maxMoonGasGiantNb)
      b.push(a.jumpOrbitPlanetMax)
      b.push(a.chanceJumpOrbitPlanets / 100)
      b.push(a.jumpOrbitMoonMax)
      b.push(a.chanceJumpOrbitMoons / 100)
      b.push(a.chanceTelluricPlanet / 100)
      b.push(a.chanceGasGiant / 100)
      b.push(a.chanceGasGiantMoon / 100)
      b.push(a.chanceMoonTelluric / 100)
      return b.join()
    },
    setParams(c) {

      let a = {}
      let b = c.split(",")
      // console.log(b)
      a.chanceMoonTelluric = parseFloat(b.pop()) * 100
      a.chanceGasGiantMoon =  parseFloat(b.pop()) * 100
      a.chanceGasGiant =  parseFloat(b.pop()) * 100
      a.chanceTelluricPlanet =  parseFloat(b.pop()) * 100
      a.chanceJumpOrbitMoons =  parseFloat(b.pop()) * 100
      a.jumpOrbitMoonMax = parseInt(b.pop())
      a.chanceJumpOrbitPlanets = parseFloat( b.pop()) * 100
      a.jumpOrbitPlanetMax = parseInt(b.pop())
      a.maxMoonGasGiantNb = parseInt(b.pop())
      a.maxMoonTelluricNb = parseInt(b.pop())
      a.maxGasGiantNb = parseInt(b.pop())
      a.maxTelluricNb = parseInt(b.pop())
      // console.log(a)
      // console.log(c)
      return a
    }
  },
  computed: {
    version() {
      return window.version.value
    },
    config() {
      return {
        orbitRadiusArrayMoonsNb: this.orbitRadiusArrayMoonsNb,
        orbitRadiusArrayPlanetNb: this.orbitRadiusArrayPlanetNb
      }
    },
    percents() {
      return {
        chancePlanetLaySide: this.chancePlanetLaySide /100,
        chanceBigObliquity: this.chanceBigObliquity /100,
        chanceTidalLock: this.chanceTidalLock /100,
        chanceTidalLock1: this.chanceTidalLock1 /100,
        chanceTidalLock2: this.chanceTidalLock2 /100,
        chanceRetrogradeOrbit: this.chanceRetrogradeOrbit /100,
        chanceBeingHabitable: this.chanceBeingHabitable /100
      }
    },
    customOrbitRadiusArrayPlanets () {
      console.log('customOrbitRadiusArrayPlanets');
      let a = this.orbitRadiusArrayPlanets
      let b = [];
      a.forEach((orbit) => {
        b.push(orbit);
      });
      b.unshift({ value: 0 });
      const mappedArray = b.map((item) => item.value)
      return mappedArray.join()
    },
    customOrbitRadiusArrayMoon () {
      const mappedArray = this.orbitRadiusArrayMoons.map((item) => item.value)
      return mappedArray.join()
    },
    orbitRadiusArrayMoonsNb () {
      if (this.useCustomOrbitRadiusArrayMoons) return this.orbitRadiusArrayMoons.length;
      return 20 // Default
    },
    orbitRadiusArrayPlanetNb () {
      if (this.useCustomOrbitRadiusArrayPlanets) return this.orbitRadiusArrayPlanets.length + 1;
      return 17 // Default
    },
    output () {
     return `## Settings file was created by innominata's Config Generator for Galactic Scale Mod v${this.version}
## Plugin GUID: touhma.dsp.galactic-scale.star-system-generation

[galactic-scale-systems]

## Enable or not the custom algorithm
# Setting type: Boolean
# Default value: true
EnableCustomStarAlgorithm = ${this.enableCustomStarAlgorithm}

## The size for the array of orbits for moons
# Setting type: Int32
# Default value: 20
OrbitRadiusArrayMoonsNb = ${this.orbitRadiusArrayMoonsNb}

## The size for the array of orbits for planets
# Setting type: Int32
# Default value: 17
OrbitRadiusArrayPlanetNb = ${this.orbitRadiusArrayPlanetNb}

## turn it to true to use your own custom orbit array for planet --> don't forget to update the OrbitRadiusArrayPlanetNb value accordingly ( +1 will be added anyway, the first orbit is always the star's one ^^'
# Setting type: Boolean
# Default value: false
UseCustomOrbitRadiusArrayPlanets = ${this.useCustomOrbitRadiusArrayPlanets}

## turn it to true to use your own custom orbit array for moons --> don't forget to update the OrbitRadiusArrayMoonsNb value accordingly
# Setting type: Boolean
# Default value: false
UseCustomOrbitRadiusArrayMoons = ${this.useCustomOrbitRadiusArrayMoons}

## Custom Array for the value in UA for the orbits of the planets
# Setting type: String
# Default value: 0,0.3,0.7,1.1,1.5,1.9,2.3,3.5,5.3,7.7,10.8,14.7,19.5,25.3,32.2,40.3,49.7,60.5
CustomOrbitRadiusArrayPlanets = ${this.customOrbitRadiusArrayPlanets}

## Custom Array for the value in UA for the orbits of the moons
# Setting type: String
# Default value: 0.048125,0.06015625,0.0751953125,0.09399414063,0.1174926758,0.1468658447,0.1835823059,0.2294778824,0.286847353,0.3585591912,0.448198989,0.5602487363,0.7003109204,0.8753886505,1.094235813,1.367794766,1.709743458,2.137179322,2.671474153,3.339342691,4.174178364
CustomOrbitRadiusArrayMoon = ${this.customOrbitRadiusArrayMoon}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForBlackHole = ${this.useCustomParamsForBlackHole}

## Custom Params for the specified system,
##  int maxTelluricNb : nb max of solid planets in the system in total,
##  int maxGasGiantNb : nb max of Gas Giants in the system in total,
## int maxMoonTelluricNb : nb max of moons around solid planets in the system in total,
##  int maxMoonGasGiantNb : nb max of moons around gas giants in the system in total,
## int jumpOrbitPlanetMax :the first planet of the host star will be on this orbit,
## float chanceJumpOrbitPlanets : lower = denser systems, higher = further away from the star,
## int jumpOrbitMoonMax: the first moon of the host planet will be on this orbit,
## float chanceJumpOrbitMoons: lower = denser systems, higher = further away from the host planet,
## float chanceTelluricPlanet: chance for a telluric planet to spawn,
## float chanceGasGiant: chance for a gas giant to spawn,
## float chanceGasGiantMoon : chance for a moon around a gasgiant to spawn,
## float chanceMoonTelluric : chance for a moon around a telluric planet to spawn
##
# Setting type: String
# Default value: 1,0,6,0,4,0.9,2,0.9,0.5,0.5,0.5,0.5
CustomParamsForBlackHole = ${this.getParams(this.customParamsForBlackHole)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForNeutronStar = ${this.useCustomParamsForNeutronStar}

## Same for neutron star
# Setting type: String
# Default value: 1,1,1,1,4,0.1,2,0.1,0.8,0.2,0.5,0.5
CustomParamsForNeutronStar = ${this.getParams(this.customParamsForNeutronStar)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForWhiteDwarf = ${this.useCustomParamsForWhiteDwarf}

## Same for neutron star
# Setting type: String
# Default value: 2,1,1,3,3,0.5,3,0.5,0.6,0.6,0.7,0.2
CustomParamsForWhiteDwarf = ${this.getParams(this.customParamsForWhiteDwarf)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForGiantStar = ${this.useCustomParamsForGiantStar}

## Same for neutron star
# Setting type: String
# Default value: 2,2,1,6,3,0.8,3,0.8,0.6,0.6,0.7,0.2
CustomParamsForGiantStar = ${this.getParams(this.customParamsForGiantStar)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassA = ${this.useCustomParamsForClassA}

## Same for Class A
# Setting type: String
# Default value: 5,4,4,8,3,0.3,3,0.4,0.7,0.4,0.6,0.5
CustomParamsForClassA = ${this.getParams(this.customParamsForClassA)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassB = ${this.useCustomParamsForClassB}

## Same for Class B
# Setting type: String
# Default value: 5,2,5,2,5,0.5,2,0.6,0.8,0.5,0.8,0.5
CustomParamsForClassB = ${this.getParams(this.customParamsForClassB)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassF = ${this.useCustomParamsForClassF}

## Same for Class F
# Setting type: String
# Default value: 4,3,2,4,3,0.6,2,0.4,0.8,0.7,0.8,0.2
CustomParamsForClassF = ${this.getParams(this.customParamsForClassF)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassG = ${this.useCustomParamsForClassG}

## Same for Class G
# Setting type: String
# Default value: 3,3,1,2,3,0.8,2,0.6,0.8,0.6,0.7,0.3
CustomParamsForClassG = ${this.getParams(this.customParamsForClassG)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassK = ${this.useCustomParamsForClassK}

## Same for Class K
# Setting type: String
# Default value: 4,3,1,4,2,0.5,2,0.5,0.8,0.8,0.8,0.2
CustomParamsForClassK = ${this.getParams(this.customParamsForClassK)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassM = ${this.useCustomParamsForClassM}

## Same for Class M
# Setting type: String
# Default value: 1,4,1,11,1,0.7,2,0.2,0.7,0.8,0.6,0.3
CustomParamsForClassM = ${this.getParams(this.customParamsForClassM)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassO = ${this.useCustomParamsForClassO}

## Same for Class O
# Setting type: String
# Default value: 7,3,6,8,4,0.2,2,0.2,0.9,0.5,0.9,0.8
CustomParamsForClassO = ${this.getParams(this.customParamsForClassO)}

## Turn it to true to use your own custom config for the specified system Class
# Setting type: Boolean
# Default value: false
UseCustomParamsForClassX = false

## Same for Class X --> not used yet AFAIK
# Setting type: String
# Default value: 0,0,0,0,0,0.0,0,0.0,0,0,0,0
CustomParamsForClassX = 0,0,0,0,0,0.,0,0.,0.,0.,0.,0.

## The Minimum Number of Telluric planet in the starting system -- should not be less than 2
# Setting type: Int32
# Default value: 2
StartingSystemMinPlanetTelluricNb = ${this.startingSystemMinPlanetTelluricNb}

## The Minimum Number of GasGiants in the starting system -- should not be less than 1
# Setting type: Int32
# Default value: 1
StartingSystemMinGasGiantNb = ${this.startingSystemMinGasGiantNb}

## The Minimum Number of Moon of Telluric Planets in the starting system -- should not be less than 1
# Setting type: Int32
# Default value: 1
StartingSystemMinTelluricMoonNb = ${this.startingSystemMinTelluricMoonNb}

## The Minimum Number of Moons of GasGiant  in the starting system -- should not be less than 1
# Setting type: Int32
# Default value: 1
StartingSystemMinGasGiantMoonNb = ${this.startingSystemMinGasGiantMoonNb}

## maximum absolute angle value for the Inclination of the orbits
# Setting type: Int32
# Default value: 35
MaxOrbitInclination = ${this.maxOrbitInclination}

## If it's a moon the inclination will be multiplied by that factor
# Setting type: Single
# Default value: 2.2
MoonOrbitInclinationFactor = ${this.moonOrbitInclinationFactor}

## If in a neutron star system the inclination will be multiplied by that factor
# Setting type: Single
# Default value: 1.3
NeutronStarOrbitInclinationFactor = ${this.neutronStarOrbitInclinationFactor}

## Chance of a planet to be on a rolling orbit --> laying on it's side
# Setting type: Single
# Default value: 0.04
ChancePlanetLaySide = ${this.percents.chancePlanetLaySide}

## Base angle Value used for the LaySide
# Setting type: Single
# Default value: 20
LaySideBaseAngle = ${this.laySideBaseAngle}

## Angle Value used to add some variation on the LaySide planets
# Setting type: Single
# Default value: 70
LaySideAddingAngle = ${this.laySideAddingAngle}

## Chance for the planet to have an high obliquity value
# Setting type: Single
# Default value: 0.1
ChanceBigObliquity = ${this.percents.chanceBigObliquity}

## Base Angle value to have an high obliquity value
# Setting type: Single
# Default value: 40
BigObliquityBaseAngle = ${this.bigObliquityBaseAngle}

## Angle Value used to add some variation on the high Obliquity
# Setting type: Single
# Default value: 30
BigObliquityAddingAngle = ${this.bigObliquityAddingAngle}

## Base Angle value to use for the obliquity of the planets, it will be the most commonly used
# Setting type: Single
# Default value: 30
StandardObliquityAngle = ${this.standardObliquityAngle}

## Base value to define the rotation period
# Setting type: Single
# Default value: 400
RotationPeriodBaseTime = ${this.rotationPeriodBaseTime}

## Value used to add some variation ( by default : value between 0-1000 + base value = final value )
# Setting type: Single
# Default value: 1000
RotationPeriodVariabilityFactor = ${this.rotationPeriodVariabilityFactor}

## Chance for a planet to be tidally locked
# Setting type: Single
# Default value: 0.1
ChanceTidalLock = ${this.percents.chanceTidalLock}

## Chance for a planet to be tidally locked --> internal type : TidalLock1
# Setting type: Single
# Default value: 0.04
ChanceTidalLock1 = ${this.percents.chanceTidalLock1}

## Chance for a planet to be tidally locked --> internal type : TidalLock2
# Setting type: Single
# Default value: 0.07
ChanceTidalLock2 = ${this.percents.chanceTidalLock2}

## Chance for a planet to have a retrograde orbit
# Setting type: Single
# Default value: 0.05
ChanceRetrogradeOrbit = ${this.percents.chanceRetrogradeOrbit}

## Value used as a base internally --> Not usefull in that context
# Setting type: Single
# Default value: 1000
HabitabilityBaseConstant = 1000

## Value to define the width of the habitability area of a star : star.habitableRadius + / - HabitableRadiusAreaBaseline --> meaning for a value of 0.2AU the area is 0.4AU wide
# Setting type: Single
# Default value: 0.2
HabitableRadiusAreaBaseline = ${this.habitableRadiusAreaBaseline}

## Chance for a planet in the habitability zone of a star to actually be habitable
# Setting type: Single
# Default value: 0.4
ChanceBeingHabitable = ${this.percents.chanceBeingHabitable}

## if planet.distance / star.habitableRadius is less than that --> the planet will be a volcano planet
# Setting type: Single
# Default value: 0.3
VolcanoPlanetDistanceRatio = ${this.volcanoPlanetDistanceRatio}

## if planet.distance / star.habitableRadius is more than that --> the planet will be an ice planet
# Setting type: Single
# Default value: 1.2
IcePlanetDistanceRatio = ${this.icePlanetDistanceRatio}`
    }
  }
}
</script>
