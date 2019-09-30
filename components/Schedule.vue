<template lang="pug">
.Schedule(:class="{'mnml': mnmlMode}")
    ModalCardEvent(v-bind="clickedEvent")
    .schedule-container
        //- .now-line(:style="{top: nowLineTop, display: nowLineDisplay}"): span.now-line-time {{now.format('HH:mm')}}
        .schedule(:style="{height: totalHeight + 'px'}")
            .schedule-day(
                v-for="events in eventsOfDays"
                :key="events.day"
            )
                //- .now-line(
                //-     :style="{top: nowLineTop, display: nowLineDisplay}",
                //- )
                .event(
                    v-for="ev in events.events"
                    :key="ev.start"
                    :style="{ \
                        backgroundColor: ev.subject.color, \
                        height: getHeight(ev), \
                        top: getTop(ev), \
                        right: getRight(ev), \
                        width: eventWidth.toString() + 'px', \
                        color: getTextColor(ev),\
                    }"
                    @click="openModal(ev)"
                    open-modal="event-card"
                    open-at="self"
                )
                    p.subject {{ev.subject.abbreviation}}
                    p.room {{ev.room}}
</template>

<script>
import moment from 'moment';
import tinycolor from 'tinycolor2'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
//-------------------------------------------------------------------
import ModalCardEvent from '~/components/ModalCardEvent.vue'

export default {
    components: { ModalCardEvent,},

    props: {
        pixelPerMinute: {
            type: Number,
            default: 1.4
        },
        now: Object
    },

    data() {
        return {
            clickedEvent: {},
            eventWidth: 135,
            mobileEventWidth: 100,
            weekdaysWithEvents: [],
            daynames: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        }
    },

    computed: {
        ...mapGetters({
            coursesIn: 'schedule/coursesIn',
            event: 'schedule/event',
            setting: 'setting',
            firstCourseStart: 'schedule/firstCourseStart',
            lastCourseEnd: 'schedule/lastCourseEnd',
        }),
        date() {
            moment.locale('fr')
            let fmt = moment(this.now).format('dddd')
            return fmt.charAt(0).toUpperCase() + fmt.substr(1)
        },
        totalHeight() {
            let start = this.firstCourseStart(this.events) / 60
            let end   = this.lastCourseEnd(this.events) / 60
            return (end - start) * this.pixelPerMinute
        },
        events() {
            let otherWeekType = this.getWeekType === 'Q1' ? 'Q2' : 'Q1'
            return this.coursesIn(
                moment(this.now).startOf('week'), 
                moment(this.now).endOf('week')
            ).filter(e => e.weekType !== otherWeekType)
        },
        eventsOfDays(day) {
            let ofDay = (day) => this.events.filter(e => e.day === day)
            let days = []
            let self = this
            this.daynames.forEach(day => {
                days.push({
                    day: day,
                    dayindex: self.daynames.indexOf(day),
                    events: ofDay(day)
                })
            })
            console.log(days)
            return days
        },
        nowLineTop() {
            let nowMins = this.now.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            console.log(this.firstCourseStart(this.events) / 60)
            return Math.abs((nowMins - (this.firstCourseStart(this.events) / 60)) * this.pixelPerMinute).toString() + 'px'
        },
        nowLineDisplay() {
            let nowMins = this.now.diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            return true
            return nowMins <= this.lastCourseEnd(this.events) / 60 ? '' : 'none'
        },
        mnmlMode() {
            return false
            return !!this.setting('mnml_mode')
        },
    },

    mounted() {
        if (window.innerWidth <= 1000) {
            this.eventWidth = this.mobileEventWidth
        }
    },

    methods: {
        getHeight(event, number=false) {
            this.pixelPerMinute 
            let start = moment(event.start, 'HH:mm:ss')
            let end   = moment(event.end,   'HH:mm:ss')
            let value = Math.abs(start.diff(end, 'minutes') * this.pixelPerMinute)
            return number ? value : value.toString() + 'px'
        },
        getTop(event, number=false) {
            let start = moment(event.start, 'HH:mm:ss').diff(moment('00:00:00', 'HH:mm:ss'), 'minutes')
            let value = Math.abs((start - this.firstCourseStart(this.events) / 60) * this.pixelPerMinute)
            return number ? value : value.toString() + 'px'
        },
        getRight(event) {
            return (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].reverse().indexOf(event.day) * this.eventWidth).toString() + 'px'
        },
        getTextColor(event) {
            return tinycolor(event.subject.color).isDark() ? 'white' : 'black'
        },
        openModal(event) {
            delete event.id // Conflicts with the BaseModal's id system (the event's id replaces the one used by the modal)
            this.clickedEvent = event
        }
    }
}
</script>

<style lang="sass" scoped>
@import '~/assets/defaults'
.schedule-container
    overflow-x: auto
.mnml .event
    .subject, .room
        opacity: 0
.heading-detail
    font-size: 24px
.HeadingSub 
    margin-right: 50px
    font-size: 24px
.schedule
    position: relative
    height: 100vh
.schedule-day
    display: flex
.event
    z-index: -1
    cursor: pointer
    position: absolute
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    .subject
        text-transform: uppercase
        // opacity: 0.5
        display: none
    .subject, .room
        font-weight: bold
        font-size: 16px
        line-height: 24px
        +mobile
            font-weight: normal
            font-size: 14px
            line-height: 20px
.now-line
    z-index: 10
    width: 100%
    background: #000000
    height: 10px
    position: relative
    pointer-events: none
.now-line-time
    position: absolute
    left: -80px
    bottom: -5px
    font-size: 24px
    font-family: 'Roboto Mono', monospace
</style>