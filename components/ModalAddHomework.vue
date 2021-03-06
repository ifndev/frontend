<template lang="pug">
BaseModal(
  name="add-homework" 
  title="Ajouter des devoirs" 
  resizable="both"
)
  .content
    PickerSubject(namespace="add-homework" @pick="cl($event); subject = $event")
    .header
      BadgeSubject(
        clickable
        @click="$modal.show('add-homework-subject-picker')"
        v-bind="subject"
        variant="responsive"
      )
      InputField.name(
        v-model="name"
        name="name"
        v-bind="{validation}"
        placeholder="Titre"
        no-error-messages, no-label
        variant="filled"
      )
    .-side-by-side
      .left
        InputField.details(
          v-model="details"
          v-bind="{validation}"
          name="details" 
          type="block"  
          variant="filled"
        ) Détails
      .right
        RadioButtons.type(
          v-model="type"
          v-bind="{validation}"
          name="type"
          variant="filled"
          :values="types" 
        ) Type de devoir
        PickerDateDue(
          namespace="add-homework"
          variant="filled"
          v-model="due"
          v-bind="{subject}"
        ) À {{dueLabelVerb}} pour le
    .submit-area
      ButtonNormal(
        v-bind="{validation}"
        @click="$emit('click', homeworkObject)"
      ) Ajouter
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import BaseModal from '~/components/BaseModal.vue'
import PickerSubject from '~/components/PickerSubject.vue'
import HeadingSub from '~/components/HeadingSub.vue'
import RadioButtons from '~/components/RadioButtons.vue'
import InputField from '~/components/InputField.vue'
import ButtonNormal from '~/components/ButtonNormal.vue'
import BadgeSubject from '~/components/BadgeSubject.vue'
import PickerDateDue from '~/components/PickerDateDue.vue'

export default {
  components: {
    BaseModal,
    PickerSubject,
    HeadingSub,
    RadioButtons,
    InputField,
    ButtonNormal,
    BadgeSubject,
    PickerDateDue
  },
  data() {
    return {
      details: null,
      mDue: null,
      name: null,
      mSubject: null,
      type: 'EXERCISE'
    }
  },
  computed: {
    ...mapState('homework', ['types']),
    ...mapGetters('schedule', ['currentSubject', 'nextCourseOf']),
    subject: {
      get() {
        return this.mSubject || this.currentSubject
      },
      set(newSubject) {
        this.mSubject = newSubject
      }
    },
    due: {
      get() {
        console.log(['due:get', !!this.mDue])
        if (this.mDue) return this.mDue
        const nextCourse = this.nextCourseOf(this.subject)
        if (nextCourse) return nextCourse.start
        return null
      },
      set(newDueDate) {
        this.mDue = newDueDate
      }
    },
    validation() {
      return this.validate()(this.homeworkObject)
    },
    dueLabelVerb() {
      return {
        EXERCISE: 'faire',
        TOBRING: 'apporter',
        COURSEWORK: 'faire',
        TEST: 'réviser'
      }[this.type]
    },
    homeworkObject() {
      return {
        subject: this.subject,
        type: this.type,
        due: this.due,
        name: this.name,
        details: this.details
      }
    }
  },
  methods: {
    ...mapGetters('homework', ['validate'])
  }
}
</script>

<style lang="stylus" scoped>
.content
  height: 100%
  display: grid
  grid-template-rows: 1fr 3fr 1fr

.header
  display: flex
  align-items: center

  @media (max-width: 650px)
    flex-direction: column
    justify-content: center

  .subject
    margin-right: 0.5em

    @media (min-width: 651px)
      max-width: 33%
      font-size: 1.75rem

    @media (max-width: 650px)
      margin-bottom: 1.5rem
      font-size: 1.25rem
      width: 100%

  .name
    width: 100%

.details
  height: 100%

.type
  flex-direction: column

  & /deep/ .RadioButton:not(:last-child)
    margin-bottom: 0.5em

  margin-bottom: 1em
  margin-top: 0.75em // FIXME: Pixel perfect. (to vertically line it up w/ the .details field)

.due.active
  & /deep/ label
    top: 0

.submit-area
  margin-top: 2rem
  display: flex
  justify-content: flex-end
  align-items: flex-end
</style>
