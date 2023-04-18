// import { Request, Response } from 'express';
// import { getPartnerById } from '../models/PartnerModel';

// async function getPartnerId(req: Request, res: Response): Promise<void> {
//   const { targetPartnerId } = req.params as PartnerIdParam;

//   const partner = await getPartnerById(targetPartnerId);

//   if (!partner) {
//     res.redirect('/preview');
//     return;
//   }

//   res.render('FindPartnerId', { partnerId: partner.partnerId });
// }

// async function makePair(req: Request, res: Response): Promise<void> {
//   const { isLoggedIn, authenticatedUser } = req.session;
//   if (!isLoggedIn) {
//     res.redirect('/login');
//     return;
//   }
//   const { userTwo } = req.body as { userTwo: User };

//   const userId1 = authenticatedUser.userId;
//   const userId2 = userTwo.userId;

//   // Retrieve user data from the database using the user IDs
//   const user1 = await getUserById(userId1);
//   const user2 = await getUserById(userId2);

//   if (!user1 || !user2) {
//     res.sendStatus(404);
//     return;
//   }

//   const partner = await addPartner(user1, user2);

//   res.redirect(`/partners/${partner.partnerId}`);
// }

// export { getPartnerId };
