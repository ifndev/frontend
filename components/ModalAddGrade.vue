<template lang="pug">
BaseModal.grade(name="add-grade" title="Ajouter une note...")
  PickerSubject(
    parent-modal="add-grade"
    @pick="subject = $event"
  )
  .header
    BadgeSubject.subject.badge(
      clickable
      @click="$modal.show('add-grade-subject-picker')"
      v-bind="subject"
    ).mobile-only
    SubjectDot.subject.dot(
      clickable
      @click="$modal.show('add-grade-subject-picker')"
      v-bind="subject"
    ).desktop-only
    InputField.name(
      v-model="name"
      placeholder="Nom de la note..."
      no-error-messages
      no-label
      variant="filled"
    )
  .-side-by-side
    .obtained-grade
      .fraction
        input.numerator(
          type="number"
          label="numerator"
          v-model="obtained"
          placeholder="?"
          min="0"
          :max="unit"
        ) 
        input.denominator(
          type="number"
          label="denominator"
          v-model="unit"
          min="1"
        )
    .date-and-other-grades
      .other-grades
        InputField(
          v-model="weight"
          type="number"
          name="weight"
          no-action-button
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Coefficient
        InputField(
          v-model="goal"
          type="number"
          name="goal"
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Objectif ({{ unit === 100 ? 'en %' : `sur ${unit}` }})
        InputField(
          v-model="expected"
          type="number"
          name="expected"
          :validation="validate()(gradeObject)"
          variant="filled"
        ) Note estimée ({{ unit === 100 ? 'en %' : `sur ${unit}` }})
  ButtonNormal.submit(
    @click="$emit('submit', gradeObject)"
    :validation="validate()(gradeObject)"
  ) Ajouter
</template>

<script>
import BaseModal from '~/components/BaseModal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import InputField from '~/components/InputField.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import SubjectDot from '~/components/SubjectDot.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import { mapGetters } from 'vuex'
export default {
  components: {BaseModal, BadgeSubject, InputField, PickerSubject, ButtonNormal, SubjectDot},
  data() {
    return {
      obtained: null,
      expected: null,
      unit: 20,   //TODO: get from settings
      weight: 1,   //TODO: get from settings
      goal: null,
      subject: null,
      name: null
    }
  },
  computed: {
    gradeObject() {
      console.log(this.subject)
      return {
        obtained: this.normalizeGrade(this.obtained),
        expected: this.normalizeGrade(this.expected),
        goal: this.normalizeGrade(this.goal),
        unit: this.unit,
        weight: this.weight,
        subject: this.subject,
        name: this.name,
      }
    }
  },
  methods: {
    // Returns a grade in [0; 1]
    normalizeGrade(grade) {
      const normalized = grade / this.unit
      if (isNaN(normalized)) return null
      return normalized
    },
    ...mapGetters('grades', ['validate'])
  },
  watch: {
    unit() {
      this.obtained /= this.unit
      this.obtained *= this.unit
    }
  }
}
</script>

<style lang="stylus" scoped>
.obtained-grade
  display flex
  align-items center
  font-size 2.5rem
  justify-content center
  margin: 1.5em 0
.other-grades
  margin-top 1.5rem
  display flex
  flex-direction column
  input
    width: 3.25em
    &:not(:last-child)
      margin-bottom 0.2em
input
  width: 100%
  font-family var(--fonts-monospace-light)
.fraction
  display flex
  flex-direction column
  justify-content center
  width 3.25em
  text-align center
  .denominator
    border-top 0.075em solid var(--black)
    margin-top 0.2em
    padding-top: 0.2em
  input
    text-align center
.multiplication
  .weight
    width 2.5em
  .operator
    margin: 0 0.2em
.grade
  display flex
  border-radius var(--border-radius)

.header
  display flex
  align-items center
  @media (max-width 650px)
    flex-direction column
    justify-content center
  .subject
    font-size 1.25rem
    margin-right 0.5em
    @media (max-width 650px)
      margin-bottom: 1.5rem
      font-size: 2rem
    &.dot
      font-size 2em
  .name
    width 100%

.submit
  display flex
  justify-content flex-end
</style>