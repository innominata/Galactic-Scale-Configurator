<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar bordered dark class="text-italic bg-grey-10 text-weight-thin q-pa-xs">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title style="font-family: 'JetBrains Mono', monospace; font-variant: small-caps; font-size:32px">
          Galactic Scale Mod Configurator
        </q-toolbar-title>

        <div>v{{version}}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >

        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

     <q-footer bordered dark class="bg-grey-10 text-weight-thin text-right q-pa-xs" style="font-size:10px">

          innovented by @innominata

    </q-footer>
  </q-layout>
</template>

<script>
window.version = { value: '1.3.2.1'}
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Planet Size Config',
    caption: '',
    icon: 'language',
    link: '/'
  },
  {
    title: 'System Generation Config',
    caption: '',
    icon: 'insights',
    link: '/sysgen'
  },
  {
    title: 'How to use',
    caption: '',
    icon: 'las la-question',
    link: '/faq'
  },
  {
    title: 'Galactic Scale Homepage',
    caption: '',
    icon: 'las la-meteor',
    link: 'http://customizing.space'
  },
  {title:'Space',
   link: ''},
  {
    title: 'MMZ Timelord\'s Config Generator',
    caption: 'The Original Config Generator',
    icon: 'table_view',
    link: 'https://docs.google.com/spreadsheets/d/1qAJ8TXZzY1HCGbZxICtpX3t6OAgr_LZaphkSi-6ODpk/edit#gid=369950817'
  },
  {
    title: 'Mod Releases',
    caption: 'github.com/releases',
    icon: 'fab fa-github',
    link: 'https://github.com/Touhma/DSP_Plugins/releases'
  },
  {
    title: 'DSP Mod Portal',
    caption: 'dsp.thunderstore.io',
    icon: 'las la-bolt',
    link: 'https://dsp.thunderstore.io/package/Touhma/Touhma_GalacticScale/'
  },
  {
    title: 'Discord Server',
    caption: 'come say hi!',
    icon: 'chat',
    link: 'https://discord.gg/Cywc7SVuxJ'
  }
]

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData,
    }
  },
  computed: {
    version() {
      return window.version.value;
    },
  },
  created () {
    this.$q.dark.set(true)
    console.log(this.$q.dark.isActive)
  }
}
</script>
