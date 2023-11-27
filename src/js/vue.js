import Vue from "vue";

new Vue({
    el: '#app',
    template:`
        <div>
            <p v-if="counter === 3">{{ title }}</p>
            <p v-else>{{ counterMultiply }}</p>
            <button @click="increaseCounter">+1</button>
            <button @click="decreaseCounter">-1</button>
            <ul>
                <li v-for="user in users">{{ user.name }}</li>
            </ul>
        </div>
    `,
    data: {
        title: 'Hello!',
        counter: 0,
        users: [
            { name: 'Jon' },
            { name: 'Sam' }
        ]
    },
    computed: {
        counterMultiply() {
            return this.counter * 2
        }
    },
    watch: {
        counter() {
            alert('counter was updated')
        }
    },
    methods: {
        increaseCounter() {
            this.counter++
        },
        decreaseCounter() {
            this.counter--
        }
    }
})
