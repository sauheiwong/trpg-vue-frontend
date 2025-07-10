<template>
    <div>
        <label>{{ capitalizeFirstLetter(option.label) }}</label>
        <input v-model="option.value" :type="option.type" :placeholder="option.placeholder" @blur="updateValue(option.label, option.value)"/>
    </div>
</template>

<script>
export default {
    name: "SettingOption",
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    emits: ['update-value'],
    methods: {
        updateValue(label, value) {
            this.$emit('update-value', label, value);
        },
        capitalizeFirstLetter(str) {
            if (typeof str !== 'string' || str.length === 0) {
                return str; // Handle non-string input or empty strings
            }
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }
}

</script>

<style scoped>
div{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
}

input{
    width: 60%;
    padding: 10px;
    background-color: var(--highlight1-color);
    color: var(--text-color);
    border: none;
    cursor: text;
}

input:focus{
    border: none;
}
</style>