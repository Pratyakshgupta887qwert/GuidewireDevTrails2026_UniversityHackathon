def get_validation_checks() -> list[str]:
	return [
		"GPS path continuity verified",
		"Delivery activity matched with disruption timeline",
		"Device trust fingerprint validated",
		"Duplicate claim pattern scan completed",
	]
