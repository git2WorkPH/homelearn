import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { CurriculumRepository } from '../application/curriculum-repository.js';
import type { CurriculumVersion } from '../domain/curriculum.js';

export class PrismaCurriculumRepository implements CurriculumRepository {
  constructor(private readonly prisma: PrismaClient) {}
  async create(version: CurriculumVersion): Promise<CurriculumVersion> {
    const row = await this.prisma.curriculum.create({
      data: {
        id: version.curriculumId,
        versions: { create: {
          id: version.id, versionLabel: version.versionLabel, sourceKind: version.provenance.kind,
          publisher: version.provenance.publisher, sourceUrl: version.provenance.sourceUrl ?? null,
          effectiveFrom: new Date(`${version.provenance.effectiveFrom}T00:00:00Z`),
          effectiveTo: version.provenance.effectiveTo === undefined ? null : new Date(`${version.provenance.effectiveTo}T00:00:00Z`),
          retrievedAt: new Date(version.provenance.retrievedAt),
          outcomes: { create: version.outcomes.map(item => ({ id: item.id, code: item.code, title: item.title, description: item.description ?? null })) },
        } },
      }, include: { versions: { include: { outcomes: true } } },
    });
    const saved = row.versions.find(item => item.id === version.id);
    if (saved === undefined) throw new Error('CURRICULUM_PERSISTENCE_INVARIANT');
    return this.mapVersion(saved);
  }
  async get(id: string): Promise<CurriculumVersion | undefined> {
    const row = await this.prisma.curriculumVersion.findUnique({ where: { id }, include: { outcomes: true } });
    return row === null ? undefined : this.mapVersion(row);
  }
  async list(): Promise<readonly CurriculumVersion[]> {
    const rows = await this.prisma.curriculumVersion.findMany({ include: { outcomes: true }, orderBy: [{ curriculumId: 'asc' }, { effectiveFrom: 'desc' }] });
    return rows.map(row => this.mapVersion(row));
  }
  private mapVersion(row: { id: string; curriculumId: string; versionLabel: string; sourceKind: string; publisher: string; sourceUrl: string | null; effectiveFrom: Date; effectiveTo: Date | null; retrievedAt: Date; outcomes: readonly { id: string; code: string; title: string; description: string | null }[] }): CurriculumVersion {
    return {
      id: row.id, curriculumId: row.curriculumId, versionLabel: row.versionLabel,
      provenance: { kind: row.sourceKind as 'official' | 'family', publisher: row.publisher, curriculumId: row.curriculumId, versionLabel: row.versionLabel, effectiveFrom: row.effectiveFrom.toISOString().slice(0, 10), retrievedAt: row.retrievedAt.toISOString(), ...(row.effectiveTo === null ? {} : { effectiveTo: row.effectiveTo.toISOString().slice(0, 10) }), ...(row.sourceUrl === null ? {} : { sourceUrl: row.sourceUrl }) },
      outcomes: row.outcomes.map(item => ({ id: item.id, code: item.code, title: item.title, ...(item.description === null ? {} : { description: item.description }) })),
    };
  }
}
