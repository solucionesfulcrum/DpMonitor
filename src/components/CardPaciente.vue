<template>
  <v-card class="mx-auto" max-width="500" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="text-overline mb-6">PACIENTE</div>
        <v-list-item-title class="text-h5 mb-1">
          {{ nombre }}
        </v-list-item-title>
      </v-list-item-content>

      <v-list-item-avatar tile size="40" color="grey"
        ><v-icon large color="blue darken-2">
          mdi-account
        </v-icon></v-list-item-avatar
      >
    </v-list-item>

    <v-card-actions>
      <v-btn outlined rounded text> Button </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CardPaciente",
  props: ["nombre"],

  data: () => ({}),
  created() {
    console.log("pacientes", this.nombre);
  },
};
</script>
