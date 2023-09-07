export interface ITrafficModel {
	trafficId: string;
	trafficUserName: string;
	trafficUserRfidCard: string;
	trafficVehicleName: string;
	trafficVehicleType: "mobil" | "motor";
	trafficVehicleColor: string;
	trafficVehicleRfid: string;
	trafficVehicleCheckIn: string;
	trafficVehicleCheckOut: string;
	trafficVehicleImage: string;
	trafficVehiclePlateNumber: string;
}
