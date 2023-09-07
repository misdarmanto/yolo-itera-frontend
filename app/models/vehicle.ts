export interface IVehicleModel {
	vehicleId?: string;
	vehiclePlateNumber?: string;
	vehicleType?: "motor" | "mobil";
	vehicleRfid?: string;
	vehicleUserId?: number;
	vehicleName?: string;
	vehicleColor?: string;
	vehiclePhoto?: string;
	user?: {
		userName: string;
	};
}
