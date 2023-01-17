<template>
  <div>
    <v-dialog v-model="dialogDataApi" hide-overlay persistent width="300">
      <v-card color="#1973a5" dark>
        <v-card-text>
          Cargando Datos
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

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
      pacientes: [],
      labels: [],
      selectedYears: [1, 2, 3, 4],
      datasets: {
        1: {
          label: "Ultrafiltracion",
          borderColor: "rgba(255, 56, 96, 0.5)",
          backgroundColor: "rgba(255, 56, 96, 0.1)",
          data: [],
        },
        2: {
          label: "peso",
          borderColor: "rgba(50, 115, 220, 0.5)",
          backgroundColor: "rgba(50, 115, 220, 0.1)",
          data: [],
        },
        3: {
          label: "PA.Sis",
          borderColor: "rgba(70, 190, 250, 0.5)",
          backgroundColor: "rgba(70, 190, 250, 0.1)",
          data: [],
        },
        4: {
          label: "PA.Dis",
          borderColor: "rgba(120, 150, 150, 0.5)",
          backgroundColor: "rgba(120, 150, 150, 0.1)",
          data: [],
        },
      },
    };
  },

  methods: {
    buscarDatos(item) {
      console.log("labels1",this.labels);
      //this.datasets=[];
      //this.labels.push("Jan", "Feb", "Mar", "Apr", "May", "Jun");
      this.labels.pop();
      this.datasets[1].data.pop();
      this.datasets[2].data.pop();
      this.datasets[3].data.pop();
      this.datasets[4].data.pop();
      //console.log("esta", this.datasets[1].data);
      console.log("boton card", item);

      this.dialogDataApi = true;
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
              console.log("respusta de servidor trat", res.data);
              console.log("algo", this.datasets);

              let claves = Object.keys(this.datasets);
              console.log("algo2", claves.length);

              for (let i = 0; i < claves.length; i++) {
                let clave = claves[i];
                console.log(this.datasets[clave]);
              }

              for (let i = 0; i < res.data.length; i++) {
                console.log("fecha", res.data[i].fecha_reg);
                this.labels.push(res.data[i].fecha_reg);
                this.datasets[1].data.push(res.data[i].ultrafil);
                this.datasets[2].data.push(res.data[i].peso);
                this.datasets[3].data.push(res.data[i].pres_art);
                this.datasets[4].data.push(res.data[i].pres_art_diast);
              }
              console.log("labels2",this.labels);
              this.dialogDataApi = false;
            })
            .catch((res) => {
              console.warn("Error:", res);
              this.dialogDataApi = false;
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
    this.dialogDataApi = true;
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
            this.dialogDataApi = false;
          })
          .catch((res) => {
            console.warn("Error:", res);
            this.dialogDataApi = false;
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

