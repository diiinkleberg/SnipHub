<template>
  <button
    class="favorite-btn"
    :class="{ 'is-favorite': isFavorited }"
    @click.prevent="toggleFavorite"
    :disabled="isLoading"
    :title="isFavorited ? 'Remove from favorites' : 'Add to favorites'">
    <i class="bi" :class="isFavorited ? 'bi-heart-fill' : 'bi-heart'"></i>
  </button>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'FavoriteButton',
  props: {
    snippetId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isLoading = ref(false);

    // Check if snippet is already in favorites
    const isFavorited = computed(() => {
      return store.getters.isFavorite(props.snippetId);
    });

    // Toggle favorite status
    const toggleFavorite = async () => {
      if (isLoading.value) return;

      try {
        isLoading.value = true;

        if (isFavorited.value) {
          await store.dispatch('removeFromFavorites', props.snippetId);
        } else {
          await store.dispatch('addToFavorites', props.snippetId);
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isFavorited,
      toggleFavorite,
      isLoading,
    };
  },
};
</script>

<style scoped>
.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  font-size: 1.25rem;
  color: #6c757d;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  color: #dc3545;
  transform: scale(1.1);
}

.favorite-btn.is-favorite {
  color: #dc3545;
}

.favorite-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
