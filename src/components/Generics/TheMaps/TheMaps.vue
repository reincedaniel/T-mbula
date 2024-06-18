<template>
    <div>
        <div ref="mapa" style="height: 400px;"></div>
        <ul>
            <li v-for="poi in pontosDeInteresse" :key="poi.id">{{ poi.name }}</li>
        </ul>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    name: 'MapaComPontosDeInteresse',
    setup() {
        const containerDoMapa = ref(null);
        const pontosDeInteresse = ref([]);
        let infoWindow = null;

        onMounted(() => {
            const mapa = new window.google.maps.Map(containerDoMapa.value, {
                center: { lat: 40.2033, lng: -8.4103 },
                zoom: 12
            });

            const servico = new window.google.maps.places.PlacesService(mapa);
            servico.nearbySearch({
                location: { lat: 40.2033, lng: -8.4103 },
                radius: 5000,
                type: ['point_of_interest']
            }, (resultados, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    pontosDeInteresse.value = resultados;
                    resultados.forEach(poi => {
                        const marcador = new window.google.maps.Marker({
                            position: poi.geometry.location,
                            map: mapa
                        });
                        marcador.addListener('click', () => {
                            if (infoWindow) {
                                infoWindow.close();
                            }
                            infoWindow = new window.google.maps.InfoWindow({
                                content: `<h3>${poi.name}</h3><p>${poi.vicinity}</p>`
                            });
                            infoWindow.open(mapa, marcador);
                        });
                    });
                }
            });
        });

        return { containerDoMapa, pontosDeInteresse };
    }
}
</script>

<style scoped>
/* Adicione estilos personalizados aqui */
</style>