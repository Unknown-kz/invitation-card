
export interface RSVPData {
  id: string;
  name: string;
  attending: 'yes' | 'with-plus-one' | 'no' | 'later';
  partnerName?: string;
  preferences?: string;
  timestamp: number;
  tableId?: number;
}

export interface Table {
  id: number;
  name: string;
  capacity: number;
  assignedGuests: string[];
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}
