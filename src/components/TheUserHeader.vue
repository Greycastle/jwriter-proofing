<template>
    <div class="header">
        <img src="/jwriter-logo.png"/>
        <div class="links">
            <a href="https://retha921.softr.app/">Home</a>
            <a href="https://retha921.softr.app/your-articles">Articles</a>
            <a href="https://retha921.softr.app/submit-article">Submit article</a>
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    background: white;
    align-items: center;
    padding: 0px 40px;
    height: 57px;
    border-bottom-color: #000000!important;
    box-shadow: 0 1px 7px rgb(0 0 0 / 10%);
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
}

.header img {
    height: 28px;
}

.header .links a {
    text-transform: uppercase;
    font-family: "Inter";
    color: black;
    font-size: 16px;
    font-weight: 600!important;
    margin-left: 32px;
}

</style>