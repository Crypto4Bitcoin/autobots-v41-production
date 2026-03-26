import { getSupabaseServerClient } from './supabase/server';

export type GovernanceAccordInput = {
  slug: string;
  title: string;
  summary?: string;
};

export const governanceRepository = {
  async createAccord(input: GovernanceAccordInput) {
    const supabase = getSupabaseServerClient();
    if (!supabase) throw new Error('No database client available');

    const { data, error } = await supabase
      .from('entities')
      .insert({
        division_slug: 'governance',
        name: input.title,
        entity_type: 'accord',
        status: 'draft',
        description: input.summary ?? '',
        metadata: { slug: input.slug }
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async ratifyAccord(id: string) {
    const supabase = getSupabaseServerClient();
    if (!supabase) throw new Error('No database client available');

    const { data, error } = await supabase
      .from('entities')
      .update({ status: 'active' }) // 'active' maps to 'enforced' or 'ratifying'
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
