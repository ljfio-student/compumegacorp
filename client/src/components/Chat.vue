<template>
    <div id="chatModel" class="modal" tabindex="-1" role="dialog" >
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Workplace Chat</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <li v-for="(message, index) in lastChat" class="list-group-item" :key="index">{{ message }}</li>
                    </ul>

                    <form @submit.prevent="sendMessage">
                        <div class="form-group">
                            <label for="message-text" class="col-form-label">Message:</label>
                            <input type="text" class="form-control" id="message-text" v-model="message" autocomplete="off" :disabled="!isConnected" />
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <span class="form-control-static pull-left">{{ connectionStatus }}</span>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button @click="sendMessage()" type="button" class="btn btn-primary">Send</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isConnected: false,
      message: "",
      chat: []
    };
  },
  computed: {
      lastChat() {
          return this.chat.slice(-10);
      },
      connectionStatus() {
          return this.isConnected ? "Connected" : "Disconnected";
      }
  },
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    message(data) {
      this.chat.push(data);
    }
  },

  methods: {
    sendMessage() {
      // Send the "pingServer" event to the server.
      if (this.isConnected) {
        this.$socket.emit("message", this.message);
        this.message = "";
      }
    }
  }
};
</script>
