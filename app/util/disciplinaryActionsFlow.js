export const actionsFlow= [
		{
			"actionCategory": "lateness",
			"resetDuration": 90,
			"actionsSuquence": [
				"warning",
				"0.5 Day",
				"1 Day",
				"2 Days",
				"HR Investigation"
			]
		},
		{
			"actionCategory": "exceeding_breaks",
			"resetDuration": 30,
			"actionsSuquence": [
				"warning",
				"warning",
				"0.5 Day",
				"1 Day",
				"2 Days",
				"HR Investigation"
			]
		},
		{
			"actionCategory": "no_show_with_call",
			"resetDuration": 90,
			"actionsSuquence": [
				"1 Day",
				"2 Days",
				"3 Days",
				"HR Investigation",
				"Termintaion"
			]
		},
		{
			"actionCategory": "no_show_without_call",
			"resetDuration": 90,
			"actionsSuquence": ["2 Days", "3 Days", "HR Investigation", "Termintaion"]
		},
		{
			"actionCategory": "attendance_manipulation",
			"resetDuration": "",
			"actionsSuquence": ["HR Investigation", "Termintaion"]
		},
		{
			"actionCategory": "early_leave",
			"resetDuration": 90,
			"actionsSuquence": ["2 Days", "HR Investigation", "Termintaion"]
		},
		{
			"actionCategory": "personal_attitude",
			"resetDuration": "",
			"actionsSuquence": ["HR Investigation"]
		},
		{
			"actionCategory": "company_assets",
			"resetDuration": "",
			"actionsSuquence": ["HR Investigation"]
		},
		{
			"actionCategory": "routing_calls",
			"resetDuration": "",
			"actionsSuquence": ["3 Days", "HR Investigation"]
		},
		{
			"actionCategory": "releasing_calls",
			"resetDuration": "",
			"actionsSuquence": ["HR Investigation"]
		},
		{
			"actionCategory": "aux_abusing",
			"resetDuration": "",
			"actionsSuquence": ["0.5 Day", "2 Days", "HR Investigation"]
		},
		{
			"actionCategory": "smoking_inside",
			"resetDuration": 180,
			"actionsSuquence": ["HR Investigation"]
		}
	]

