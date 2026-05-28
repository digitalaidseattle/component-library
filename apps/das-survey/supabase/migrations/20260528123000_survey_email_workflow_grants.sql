grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.survey_contacts
  to anon, authenticated, service_role;

grant select, insert, update, delete on public.survey_email_campaigns
  to anon, authenticated, service_role;

grant select, insert, update, delete on public.survey_email_recipients
  to anon, authenticated, service_role;

grant select, insert, update, delete on public.survey_responses
  to anon, authenticated, service_role;

alter table public.survey_contacts disable row level security;
alter table public.survey_email_campaigns disable row level security;
alter table public.survey_email_recipients disable row level security;
alter table public.survey_responses disable row level security;
