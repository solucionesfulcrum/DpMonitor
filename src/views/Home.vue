<template>
  <div>
    <v-dialog v-model="dialog" width="600">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Datos </v-card-title>

        <v-card-text>
          <monthly-sales-chart
            :labels="labels"
            :selectedYears="selectedYears"
            :datasets="datasets"
          ></monthly-sales-chart>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> cerrar </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="start">
      <v-col v-for="paciente in pacientes" :key="paciente.id" cols="12" md="4">
        <v-card class="mx-auto" max-width="500" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-overline mb-6">PACIENTE</div>
              <v-list-item-title class="text-h7 mb-1">
                {{
                  paciente.nombres +
                  " " +
                  paciente.ape_pat +
                  " " +
                  paciente.ape_mat
                }}
              </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar tile size="50" color="grey"
              ><v-icon large color="blue darken-2">
                mdi-account
              </v-icon></v-list-item-avatar
            >
          </v-list-item>

          <v-card-actions>
            <v-btn outlined @click="buscarDatos(paciente.url)" rounded text>
              Ver
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import MonthlySalesChart from "../components/MonthlySalesChart.vue";
import axios from "axios";
export const RUTA_SERVIDOR = process.env.VUE_APP_RUTA_API;

export default {
  name: "app",
  components: {
    MonthlySalesChart,
  },

  data() {
    return {
      dialog: false,
      data: [600, 550, 750, 250, 700],
      pacientes: [],
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      selectedYears: [1, 2, 3, 4],
      datasets: {
        1: {
          label: "Ultrafiltracion",
          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
          data:  [600, 550, 750, 250, 700],
        },
        2: {
          label: "peso",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
          data: [300, 700, 450, 750, 450],
        },
        3: {
          label: "PA.Sis",
          borderColor: "rgba(70, 190, 250, 0.5)",
          backgroundColor: "rgba(70, 190, 250, 0.1)",
          data: [100, 500, 250, 250, 650],
        },
        4: {
          label: "PA.Dis",
          borderColor: "rgba(120, 150, 150, 0.5)",
          backgroundColor: "rgba(120, 150, 150, 0.1)",
          data: [800, 400, 150, 350, 950],
        },
      },
    };
  },

  methods: {
    buscarDatos(item) {
      console.log("boton card", item);
      this.dialog = true;
      axios
        .post(RUTA_SERVIDOR + "/api/token/", {
          username: "cnsr",
          password: "123456",
        })
        .then((response) => {
          this.auth = "Bearer " + response.data.access;
          axios
            .get(
              RUTA_SERVIDOR +
                "/dialisisPeritoneal/?search=" +
                item.split("/")[4],
              {
                headers: { Authorization: this.auth },
              }
            )
            .then((res) => {
              console.log("respusta de servidor", res.data);
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialog = false;
            });
        })
        .catch((response) => {
          response === 404
            ? console.warn("lo sientimos no tenemos servicios")
            : console.warn("Error:", response);
        });
    },
  },

  created() {
    axios
      .post(RUTA_SERVIDOR + "/api/token/", {
        username: "cnsr",
        password: "123456",
      })
      .then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios
          .get(RUTA_SERVIDOR + "/pacientes/", {
            headers: { Authorization: this.auth },
          })
          .then((res) => {
            this.pacientes = res.data;
            console.log("respusta de servidor", this.pacientes);
          })
          .catch((res) => {
            console.warn("Error:", res);
            this.dialog = false;
          });
      })
      .catch((response) => {
        response === 404
          ? console.warn("lo sientimos no tenemos servicios")
          : console.warn("Error:", response);
      });
  },
};
</script>

