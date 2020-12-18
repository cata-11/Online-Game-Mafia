<template>
<div>
    <FlipCountdown deadline="2020-12-5 00:00:00" :showDays="false" :showHours="false">
    </FlipCountdown>
</div>
</template>
 
<script>
 import FlipCountdown from 'vue2-flip-countdown'

export default {
  
    components: {
        FlipCountdown,

    }
};
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500&display=swap');
*{
    color: white;
    font-size: 5rem;
    }

</style>