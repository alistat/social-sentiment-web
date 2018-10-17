<template lang="pug">
  div.wrap
    .main
      #content
        nuxt

</template>

<style  lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background-color:whitesmoke;

}



*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

input[type=color] {
  border: 1px solid rgb(207, 214, 230);
  padding: 3px 8px;
  width: 44px;
  border-radius: 3px;
  height: 25px;
}

.btn, button {
  background: #93969b;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.2rem;
  transition: color 0.3s, background 0.4s;
  //font-size: 1rem;
}
.btn:hover, button:hover {
  background: #555555;
  color: white;
  transition: color 0.4s, background 0.5s;
}



.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

#content {
  width: 60rem;
  max-width: 98%;
  margin: auto;
  background: white;
  min-height: 50rem;
  padding: 1rem 0;
  margin-bottom: 2rem;
  border: 1px solid #e9e9e9;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
