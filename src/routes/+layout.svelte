<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<title>CipherNova - Post-Quantum Secure Communication</title>
	<meta name="description" content="Quantum-resistant secure messaging application" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="app-container">
	{@render children()}
</div>

<style>
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}
</style>
