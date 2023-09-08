export interface ITrafficModel {
	trafficId: string;
	trafficUserName: string;
	trafficUserRfidCard: string;
	trafficVehicleName: string;
	trafficVehicleType: "mobil" | "motor";
	trafficStatus: "checkIn" | "checkOut";
	trafficVehicleColor: string;
	trafficVehicleRfid: string;
	trafficVehicleCheckIn: string;
	trafficVehicleCheckOut: string;
	trafficVehicleImage: string;
	trafficVehiclePlateNumber: string;
}
