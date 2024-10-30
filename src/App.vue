<script></script>

<template>
  <RouterView />
</template>

<style lang="scss">
body {
  font-family: 'Poppins', sans-serif;
  font-style: normal;
  background-color: get-color(secondary);

}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: get-color(secondary); 

}
::-webkit-scrollbar-thumb {
  background: get-color(primary); 
  opacity: 0.8;
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>
