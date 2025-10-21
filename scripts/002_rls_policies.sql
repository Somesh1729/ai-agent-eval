-- RLS Policies for eval_settings table
CREATE POLICY "eval_settings_select_own" ON public.eval_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "eval_settings_insert_own" ON public.eval_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "eval_settings_update_own" ON public.eval_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "eval_settings_delete_own" ON public.eval_settings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for evals table
CREATE POLICY "evals_select_own" ON public.evals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "evals_insert_own" ON public.evals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "evals_update_own" ON public.evals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "evals_delete_own" ON public.evals
  FOR DELETE USING (auth.uid() = user_id);
