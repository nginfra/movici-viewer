import { ComponentProperty, Update, UpdateWithData, UUID } from '@/flow/types';

export default interface UpdatesService {
  get({
    uuid,
    entityGroup,
    properties
  }: {
    uuid: UUID;
    entityGroup: string;
    properties: ComponentProperty[];
  }): Promise<UpdateWithData | null>;

  list(uuid: string): Promise<Update[] | null>;
}
