<template>
  <q-page>
    <q-card class="q-ma-sm row">
      <!-- <q-toggle v-model="basic" label="Use Limited Resizing Feature (Recommended)"/> -->
      <q-space />
      <q-file
      outlined
      v-model="file"
      accept=".cfg"
      label="Upload Config"
      style="max-width: 200px"
    />

    </q-card>
    <q-card class="q-ma-sm q-pa-md">
      <q-card class="">
        <q-card v-if="basic">
          <div class="text-h6">
            Telluric Planet Sizes
          </div>
          Please note, there are Foundation placement bugs with planet sizes above 250m<br/><br/>
          <div
            class="q-gutter-md row items-start"
            v-for="(item, index) in planetRadiusArray"
            :key="index">
            <q-input
              dense
              @blur="validatePlanetSize(item.size, index)"
              v-model.number="item.size"
              label="Size"
              suffix="m"
              input-class="text-right"
            />
            <q-input
              dense
              label="Frequency (Relative)"
              @blur="validatePlanetChance(item.chance, index)"
              v-model.number="item.chance"
            />

            <q-btn flat color="red" icon="las la-trash-alt" @click="planetRadiusArray.splice(index,1)"/>
          </div>
          <q-btn
            icon="add"
            dense outline
            @click="planetRadiusArray.push({size:'', chance:''})"
          >Add New Planet Size</q-btn>
        </q-card>

        <!-- <q-card v-if="!basic">
          <div class="text-h6">Telluric Planet Sizes (Advanced)</div>
          <div class="text-red">This is currently broken, and should not be used.</div>
          <br/>
          Telluric Planets<br/>
          <div class="row">
            <q-input dense outlined v-model.number="minTelluricSize" type="number" label="Minimum Size" @blur="validateTelluricSizes"></q-input>
            <q-input dense outlined v-model.number="baseTelluricSize" type="number" label="Base Size" @blur="validateTelluricSizes"></q-input>
            <q-input dense outlined v-model.number="maxTelluricSize" type="number" label="Max Size" @blur="validateTelluricSizes"></q-input>
            <q-input dense outlined v-model.number="baseTelluricSizeVariationFactor" type="number" label="Variation" @blur="validateTelluricSizes"></q-input>
          </div>
          Planets will be generated in the range of {{Math.max(Number(minTelluricSize), Number(baseTelluricSize) - Number(baseTelluricSizeVariationFactor))}} to {{Math.min(Number(maxTelluricSize), Number(baseTelluricSize) + Number(baseTelluricSizeVariationFactor))}}.
        </q-card> -->
      </q-card>
    </q-card>


    <q-card class="q-ma-sm q-pa-md row items-start">
          <div class="text-h6 col-12 q-pb-sm">Gas Giant Planets</div>
          <div class="q-gutter-md row items-start">
            <q-input dense v-model.number="baseGasGiantSize" label="Base Size" @blur="validateGasGiantSizes"></q-input>
            <q-input  dense v-model.number="baseGasGiantSizeVariationFactor" label="Variation" @blur="validateGasGiantSizes"></q-input>
          </div>
          <div class="col-12 q-pt-sm">Gas Giants will be generated in the range of {{Number(baseGasGiantSize) - Number(baseGasGiantSizeVariationFactor)}} to {{Number(baseGasGiantSize) + Number(baseGasGiantSizeVariationFactor)}}.</div>
    </q-card>
    <q-card class="q-ma-sm q-pa-md">
      Ensure moons are smaller than planets <q-toggle v-model="enableMoonSizeFailSafe" />
    </q-card>
    <q-card class="q-ma-sm q-pa-md">
      <q-btn :color="preview?'blue':'white'" outline @click="preview = !preview">Preview</q-btn>
      <q-btn class="q-ml-md" outline @click="download">Download</q-btn>
      <highlightjs language='c#' :code="output" v-if="preview"/>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PlanetSize',
  data () {
    return {
      file: null,
      preview:false,
      basic: true,
      planetRadiusArray: [{ size: 50, chance: 5 }, { size: 100, chance: 3 }, { size: 200, chance: 2 }],
      enableMoonSizeFailSafe: true,
      baseTelluricSize: 280,
      minTelluricSize: 80,
      maxTelluricSize: 480,
      baseGasGiantSize: 2000,
      baseTelluricSizeVariationFactor: 200,
      baseGasGiantSizeVariationFactor: 1200,
      input: '',
      inputArray:[],
      parsedArray: [],
    }
  },
  watch: {
    file() {
      this.loadFile(this.file);
    }
  },
  computed: {
    version() {
      return window.version.value
    },
    enableLimitedResizingFeature: {
      get() {
        if (this.basic) return true
        return false
      },
      set(val) {
        console.log('limited set', val)
        if (val) this.basic = true;
        else this.basic = false;
      }
    },
    enableResizingFeature: {
      get() {
        if (this.basic) return false
        return true
      },
      set(val) {
        console.log('unlimited set', val)
        //if (val) this.basic = false;
        //else this.basic = true;
      }
    },
    resizingArraySizesText () {
      let text = ''

      this.planetRadiusArray.forEach((item, index) => {
        if (parseFloat(item.chance) > 0 && parseFloat(item.size) > 0) text += item.size + ','
      })

      return text.substr(0, text.length - 1)
    },
    resizingArrayChancesText () {
      let text = ''
      let total = 0
      let accum = 0

      this.planetRadiusArray.forEach((item, index) => {
        if (parseFloat(item.chance) > 0 && parseFloat(item.size) > 0) total += parseFloat(item.chance)
      })

      this.planetRadiusArray.forEach((item, index) => {
        if (parseFloat(item.chance) > 0 && parseFloat(item.size) > 0) {
          accum += parseFloat(item.chance)
          text += Math.round((accum / total) * 1000) / 1000 + ','
        }
      })

      return text.substr(0, text.length - 1)
    },
    output () {
      return `## Settings file was created by Inno's Blatant Ripoff of MMZTimeLord's Config Generator for Touhmas Galactic Scale Mod v${this.version}
## Plugin GUID: touhma.dsp.galactic-scale.planet-size

[galactic-scale-planets-size]

## limited version of the resizing feature : will be here the time we fix the other one --> if true : EnableCustomStarAlgorithm=true from the generation is a dependency --> should put EnableResizingFeature to false if activated
# Setting type: Boolean
# Default value: true
EnableLimitedResizingFeature = ${this.enableLimitedResizingFeature}

## limited version of the resizing feature : will be here the time we fix the other one
# Setting type: String
# Default value: 50,100,200
LimitedResizingArray = ${this.resizingArraySizesText}

## chances for each size to appear --> 0 -> 0.5  = 1 , 0.5 -> 0.8 = 2 etc ...
# Setting type: String
# Default value: 0.5,0.8,1
LimitedResizingChances = ${this.resizingArrayChancesText}

## Decide if the resizing of the planets is enabled or not --> if true : EnableCustomStarAlgorithm=true from the generation is a dependency --> should put EnableLimitedResizingFeature to false if activated
# Setting type: Boolean
# Default value: false
EnableResizingFeature = ${this.enableResizingFeature}

## EnableMoonSizeFailSafe -> enable and the moon will never be bigger than the host planet , true by default
# Setting type: Boolean
# Default value: true
EnableMoonSizeFailSafe = ${this.enableMoonSizeFailSafe}

## Base Telluric planet Size  -- Not Advised to modify YET
# Setting type: Single
# Default value: 280
BaseTelluricSize = ${this.baseTelluricSize}

## Min Value Telluric planet Size. Should be BaseTelluricSize - BaseTelluricSizeVariationFactor  -- Not Advised to modify YET
# Setting type: Single
# Default value: 80
MinTelluricSize = ${this.minTelluricSize}

## Max Value Telluric planet Size --> more that than CAN break and is not supported YET. Should be BaseTelluricSize + BaseTelluricSizeVariationFactor  -- Not Advised to modify YET
# Setting type: Single
# Default value: 480
MaxTelluricSize = ${this.maxTelluricSize}

## Base Gas Giant Size  -- Not Advised to modify YET
# Setting type: Single
# Default value: 2000
BaseGasGiantSize = ${this.baseGasGiantSize}

## Used to create variation on the planet size : help defining the min & max size for a Telluric planet-- Not Advised to modify YET
# Setting type: Single
# Default value: 200
BaseTelluricSizeVariationFactor = ${this.baseTelluricSizeVariationFactor}

## Used to create variation on the planet size : help defining the min & max size for a gas giant --  -- Not Advised to modify YET
# Setting type: Single
# Default value: 1200
BaseGasGiantSizeVariationFactor = ${this.baseGasGiantSizeVariationFactor}`
    }
  },
  methods: {
    updateOptions(options) {
      this.baseGasGiantSize = options.baseGasGiantSize;
      this.baseGasGiantSizeVariationFactor = options.baseGasGiantSizeVariationFactor;
      this.baseTelluricSize = options.baseTelluricSize;
      this.baseTelluricSizeVariationFactor = options.baseTelluricSizeVariationFactor;
      if (options.enableLimitedResizingFeature == "true") this.basic = true;
      // console.log(options.enableResizingFeature, 'erf', !!options.enableResizingFeature);
      if (options.enableResizingFeature == "true") this.basic = false;
      this.enableMoonSizeFailSafe = (options.enableMoonSizeFailSafe == "true")?true:false;
      this.maxTelluricSize = options.maxTelluricSize;
      this.minTelluricSize = options.minTelluricSize;
      let lra = options.limitedResizingArray.split(',');
      let lrt = options.limitedResizingChances.split(',');
      let lrc = []

      for (var i = 0; i < lrt.length; i++) {
        if (i == 0) lrc.push(Math.round(100*Number(lrt[i])));
        else lrc.push(Math.round(100*(Number(lrt[i]) - Number(lrt[i-1]))));
      }
      let lowest = Number.POSITIVE_INFINITY;
      for (var i = 0; i < lrc.length; i++) {
        if (lrc[i] < lowest) lowest = lrc[i];
      }
      console.warn(lowest);
      for (var i = 0; i < lrc.length; i++) {
        lrc[i] = Math.round(lrc[i] / lowest);
      }
      this.planetRadiusArray = [];
      console.log(lra,lrc);
      lra.forEach((size, n) => {
        console.log({size, chance: lrc[n]});
        this.planetRadiusArray.push({size, chance: lrc[n]});
      });
//       planetRadiusArray: [{ size: 50, chance: 5 }, { size: 100, chance: 3 }, { size: 200, chance: 2 }],
// limitedResizingArray: "150,500,600"
// limitedResizingChances: "0.5,0.8,1"

    },
    loadFile(file) {
      console.log('file parse');
      console.log(this.file);
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
        if (l == '[') if (line != '[galactic-scale-planets-size]') {
          alert('This doesn\'t seem to be a valid Planet Size Config');
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
        // console.log('Setting', key, val);
        options[key] = val;
      });
      // console.log(options);
      this.updateOptions(options);

    },
    validatePlanetChance (chance, n) {
      if (chance === 0) this.planetRadiusArray[n].chance = 1
    },
    validatePlanetSize (size, n) {
      if (size > 650) this.planetRadiusArray[n].size = 650
      else if (size <= 10) this.planetRadiusArray[n].size = 10
      else if (size % 10 > 0) this.planetRadiusArray[n].size = Math.ceil(size / 10) * 10
    },
    download () {
      const blob = new Blob([this.output], { type: 'text/plain' })
      const a = document.createElement('a')
      a.download = 'dsp.galactic-scale.planet-size.cfg'
      a.href = URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/plain', a.download, a.href].join(':')
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(function () { URL.revokeObjectURL(a.href) }, 1500)
    },
    validateTelluricSizes () {
      if (this.maxTelluricSize > 650) this.maxTelluricSize = 650
      if (this.minTelluricSize < 10) this.minTelluricSize = 10
      this.baseTelluricSize = this.round10(this.baseTelluricSize)
      this.minTelluricSize = this.round10(this.minTelluricSize)
      this.maxTelluricSize = this.round10(this.maxTelluricSize)
      this.baseTelluricSizeVariationFactor = this.round10(this.baseTelluricSizeVariationFactor)
      if (this.minTelluricSize > this.baseTelluricSize) this.minTelluricSize = this.baseTelluricSize
      if (this.maxTelluricSize < this.baseTelluricSize) this.maxTelluricSize = this.baseTelluricSize
    },
    validateGasGiantSizes () {
      this.baseGasGiantSizeVariationFactor = this.round100(this.baseGasGiantSizeVariationFactor)
      this.baseGasGiantSize = this.round100(this.baseGasGiantSize)
    },
    round10 (n) {
      if (n % 10 > 0) return Math.round(n / 10) * 10
      return n
    },
    round100 (n) {
      if (n % 100 > 0) return Math.round(n / 100) * 100
      return n
    }
  }
}
</script>
