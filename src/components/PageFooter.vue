<template>
  <footer class="section rab-footer">
    <div class="pt-5 divider" />
    <div class="columns">
      <div class="column is-11">
        <p>
          © 2024
          <a
            class="contributor-link"
            href="https://github.com/jeremystucki"
            target="_blank"
            rel="noopener noreferrer"
          >Jeremy Stucki</a>,
          <a
            class="contributor-link"
            href="https://github.com/unkelhoebbi"
            target="_blank"
            rel="noopener noreferrer"
          >Gregor Stuber</a>,
          <a
            class="contributor-link"
            href="https://github.com/joshuabeny1999"
            target="_blank"
            rel="noopener noreferrer"
          >Joshua Hürzeler</a>,
          <a
            class="contributor-link"
            href="https://github.com/Mafii"
            target="_blank"
            rel="noopener noreferrer"
          >Mathias Fischler</a>,
          <a
            class="contributor-link"
            href="https://github.com/lzkndg"
            target="_blank"
            rel="noopener noreferrer"
          >Luzia Kündig</a>,
          <a
            class="contributor-link"
            href="https://github.com/StefanieJaeger"
            target="_blank"
            rel="noopener noreferrer"
          >Stefanie Jäger</a>,
          <a
            class="contributor-link"
            href="https://github.com/Venyla"
            target="_blank"
            rel="noopener noreferrer"
          >Vina Zahnd</a>,
          <a
            class="contributor-link"
            href="https://github.com/CHLinusch"
            target="_blank"
            rel="noopener noreferrer"
          >Linus Flury</a>
        </p>
      </div>
      <div class="column is-1 ml-auto">
        <a
          class="mr-4 is-inline-block"
          href="https://github.com/lost-university"
        >
          <font-awesome-icon
            :icon="['fab', 'github']"
            size="2x"
            class="social"
          />
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageFooter',
});
</script>
