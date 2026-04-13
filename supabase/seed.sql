insert into users (id, auth_user_id, company_name)
values ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'N&J Intérieurs')
on conflict do nothing;

insert into clients (id, owner_id, first_name, last_name, phone, email, address, notes)
values
('22222222-2222-2222-2222-222222222221','11111111-1111-1111-1111-111111111111','Camille','Lemaire','+33 6 45 22 18 74','camille.lemaire@email.com','12 avenue Foch, Paris','Préférence finitions chêne clair'),
('22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111','Alexandre','Moreau','+33 6 18 07 92 53','a.moreau@email.com','5 rue du Bac, Lyon','Suivi hebdomadaire le vendredi')
on conflict do nothing;

insert into projects (id, owner_id, client_id, title, site_address, description, status, start_date, estimated_end_date, quote_amount, billed_amount, deposit_received, balance_received, internal_notes)
values
('33333333-3333-3333-3333-333333333331','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222221','Rénovation cuisine & séjour','12 avenue Foch, Paris','Refonte complète cuisine ouverte','en_cours','2026-03-10','2026-05-22',48000,24000,14400,9600,'Valider teinte laiton brossé'),
('33333333-3333-3333-3333-333333333332','11111111-1111-1111-1111-111111111111','22222222-2222-2222-2222-222222222222','Aménagement suite parentale','5 rue du Bac, Lyon','Dressing premium et tête de lit','devis_accepte','2026-04-18','2026-06-20',36000,0,10800,0,'Lancer commande tissu')
on conflict do nothing;

insert into tasks (owner_id, project_id, title, due_date, priority, status)
values
('11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333331','Planifier réunion artisan plomberie','2026-04-14','haute','todo'),
('11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333332','Envoyer relance acompte','2026-04-13','critique','en_cours')
on conflict do nothing;

insert into service_tickets (owner_id, project_id, client_id, title, due_date, priority, status)
values
('11111111-1111-1111-1111-111111111111','33333333-3333-3333-3333-333333333331','22222222-2222-2222-2222-222222222221','Réglage porte placard','2026-04-20','moyenne','ouvert')
on conflict do nothing;
