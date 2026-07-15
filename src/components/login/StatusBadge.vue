<script setup lang="ts">
defineProps<{
  label: string
  tone?: 'cyan' | 'violet' | 'emerald'
}>()
</script>

<template>
  <span :class="['status-badge', tone ?? 'cyan']">
    <i />
    {{ label }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  border: 1px solid rgba(125, 211, 252, 0.2);
  border-radius: 999px;
  padding: 0 12px;
  color: rgba(226, 245, 255, 0.82);
  background: rgba(8, 19, 35, 0.42);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  font-size: 11px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  backdrop-filter: blur(14px);
}

.status-badge i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #67e8f9;
  box-shadow: 0 0 16px rgba(103, 232, 249, 0.82);
}

.status-badge.violet {
  border-color: rgba(168, 85, 247, 0.24);
}

.status-badge.violet i {
  background: #c084fc;
  box-shadow: 0 0 16px rgba(192, 132, 252, 0.78);
}

.status-badge.emerald {
  border-color: rgba(45, 212, 191, 0.24);
}

.status-badge.emerald i {
  background: #2dd4bf;
  box-shadow: 0 0 16px rgba(45, 212, 191, 0.78);
}
</style>
