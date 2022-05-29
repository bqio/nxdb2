const { createApp } = Vue;

function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

function onImageError(source, banner) {
  source.src = banner;
  return true;
}

const app = createApp({
  data() {
    return {
      titles: [],
      offset: 0,
      offsetEnd: 20,
      modal: {
        isShow: false,
        isError: false,
        timer: null,
        text: "",
      },
    };
  },
  methods: {
    checkPosition() {
      const height = document.body.offsetHeight;
      const screenHeight = window.innerHeight;
      const scrolled = window.scrollY;
      const threshold = height - screenHeight / 2;
      const position = scrolled + screenHeight;

      if (position >= threshold) {
        this.offsetEnd += 20;
      }
    },
    showModal(text, isError = false) {
      if (this.modal.timer) {
        clearTimeout(this.modal.timer);
      }

      this.modal.text = text;
      this.modal.isError = isError;
      this.modal.isShow = true;
      this.modal.timer = setTimeout(this.closeModal, 3000);
    },
    closeModal() {
      this.modal.timer = null;
      this.modal.isShow = false;
    },
    download(title) {
      if (title.hash == "") {
        this.showModal(
          "Hash not found. Visit github if you want added them.",
          true
        );
      } else {
        this.showModal(`Downloading ${title.title}...`);
        if (window.nx) {
          window.nx.sendMessage(`magnet:?xt=urn:btih:${title.hash}\0`);
        } else {
          window.open(`magnet:?xt=urn:btih:${title.hash}`, "_self");
        }
      }
    },
    onImageError(evt, banner) {
      evt.target.src = banner;
    },
  },
  computed: {
    titleList() {
      return this.titles.slice(this.offset, this.offsetEnd);
    },
  },
  async mounted() {
    const response = await fetch("../data/nxdb.json");
    this.titles = await response.json();
  },
}).mount("#app");

window.addEventListener("scroll", throttle(app.checkPosition, 700));
