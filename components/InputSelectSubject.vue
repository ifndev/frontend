<template lang="pug">
InputSelect(
	:options="filter(choices)"
	@input="$emit('input', ($event && ($event.uuid === null ? null : $event)))"
	:value="value === null ? emptyChoiceObj : value"
	label="name"
	:track-by="null"
	v-bind="{placeholder, name}"
	:allow-empty="!!emptyChoice"
	searchable
	)
		template(
			:slot="slot" v-for="slot in ['singleLabel', 'option']"
			slot-scope="props"
			)
			template(v-if="props.option.uuid === null")
				slot(name="empty-option")
					Icon.icon(filled) donut_small
					span {{ props.option.name }} 
			template(v-else)
				BadgeSubject(v-bind="props.option" variant="dot" no-tooltip)
				span.subject-name {{ props.option.name }}
		template(slot="noOptions")
			p Aucun résultat.
</template>

<script>
import { mapGetters } from 'vuex'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputSelect from '~/components/InputSelect.vue'
import Icon from '~/components/Icon.vue'

export default {
  components: { BadgeSubject, InputSelect, Icon },
  props: {
    value: Object,
    placeholder: {
      type: String,
      default: 'Choisissez une matière'
    },
    name: String,
    filter: {
      type: Function,
      default: (subjects) => subjects
    },
    emptyChoice: {
      type: [String, Boolean],
      default: 'Tout'
    }
  },
  computed: {
    ...mapGetters('subjects', ['all']),
    emptyChoiceObj() {
      return { uuid: null, name: this.emptyChoice }
    },
    choices() {
      if (!this.emptyChoice) return this.all
      return [this.emptyChoiceObj, ...this.all]
    }
  }
}
</script>

<style lang="stylus" scoped>
.multiselect /deep/ .icon
  margin-right: 0.2em
  font-size: 1.5em
  margin-left: -0.1em
</style>
