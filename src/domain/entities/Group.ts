export interface GroupMember {
  id: string;
  username: string;
}

export interface Group {
  id: string;
  name: string;
  members: GroupMember[]; // tableau d'objets avec id et name
}
