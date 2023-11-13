<template>
	<div class="pending-edits-container">
		<h2>Pending Edits</h2>
		<div v-for="(edit, productId) in pendingEdits" :key="productId" class="edit-item">
			<h3>Product ID: {{ productId }}</h3>
			<div v-for="(value, key) in edit" :key="key" class="edit-detail">
				<strong>{{ formatKey(key) }}:</strong> {{ formatValue(value) }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'PendingUpdates',
	props: {
		pendingEdits: {
			type: Object,
			required: true,
		},
	},
	methods: {
		formatKey(key) {
			// Format the key for display (e.g., convert camelCase to Regular Case)
			return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
		},
		formatValue(value) {
			// Format the value for display (e.g., array to comma-separated string)
			return Array.isArray(value) ? value.join(', ') : value;
		},
	},
};
</script>

<style scoped>
.pending-edits-container {
	border: 1px solid #ddd;
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	max-width: 600px;
	margin: 20px auto;
}

.edit-item {
	border-bottom: 1px solid #eee;
	padding: 10px 0;
}

.edit-item:last-child {
	border-bottom: none;
}

.edit-detail {
	margin: 5px 0;
	font-size: 14px;
}

h2 {
	text-align: center;
	color: #333;
}

h3 {
	color: #555;
}
</style>
