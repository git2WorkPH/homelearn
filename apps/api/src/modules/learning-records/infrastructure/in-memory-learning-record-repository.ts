import type { LearnerLearningRecord, LearningExperience, OutcomeAssessment } from '../domain/learning-record.js';
import type { LearningRecordRepository } from '../application/learning-record-repository.js';
export class InMemoryLearningRecordRepository implements LearningRecordRepository {
  readonly #experiences=new Map<string,LearningExperience>(); readonly #records=new Map<string,LearnerLearningRecord>(); readonly #assessments=new Map<string,OutcomeAssessment>();
  async createExperience(item:LearningExperience):Promise<LearningExperience>{if(this.#experiences.has(item.id))throw new Error('DUPLICATE_EXPERIENCE');this.#experiences.set(item.id,item);return item;}
  async getExperience(id:string):Promise<LearningExperience|undefined>{return this.#experiences.get(id);}
  async listExperiences():Promise<readonly LearningExperience[]>{return [...this.#experiences.values()];}
  async createLearnerRecord(item:LearnerLearningRecord):Promise<LearnerLearningRecord>{if(this.#records.has(item.id))throw new Error('DUPLICATE_LEARNER_RECORD');this.#records.set(item.id,item);return item;}
  async getLearnerRecord(id:string):Promise<LearnerLearningRecord|undefined>{return this.#records.get(id);}
  async listLearnerRecords(experienceId?:string):Promise<readonly LearnerLearningRecord[]>{return [...this.#records.values()].filter(item=>experienceId===undefined||item.experienceId===experienceId);}
  async createAssessment(item:OutcomeAssessment):Promise<OutcomeAssessment>{if(this.#assessments.has(item.id))throw new Error('DUPLICATE_ASSESSMENT');this.#assessments.set(item.id,item);return item;}
}
