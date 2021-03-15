<template>
  <div><q-item
    v-if="link != ''"
    dark
    clickable
    tag="a"
    target=""
    :href="link"
    
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label dark :class="($route.path == link)?'text-blue':'text-white'">{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item v-else><q-separator/></q-item></div>
</template>

<script>
export default {
  name: 'EssentialLink',
  created() {

  },
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
    },

    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
