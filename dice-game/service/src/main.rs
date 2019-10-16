use map_vec::Map;
use oasis_std::{Address, Context};
use rand::Rng;

#[derive(oasis_std::Service)]
struct DiceGame {
    max_score: u32,
    num_players: u32,
    scores: Map<Address, u32>,
}

type Result<T> = std::result::Result<T, String>;
impl DiceGame {
    pub fn new(_ctx: &Context, num_players: u32) -> Self {
        Self {
            max_score: 0,
            num_players,
            scores: Map::new(),
        }
    }

    /// returns whether still in play
    pub fn is_in_play(&self, _ctx: &Context) -> bool {
        self.scores.len() < (self.num_players as usize)
    }

    /// returns num_players
    pub fn num_players(&self, _ctx: &Context) -> u32 {
        self.num_players
    }

    /// returns the max score in play
    pub fn max_score(&self, _ctx: &Context) -> u32 {
        self.max_score
    }

    /// rolls a dice, resulting in a random number from 1-6
    pub fn roll(&mut self, ctx: &Context) -> Result<u32> {
        if self.scores.len() >= (self.num_players as usize) {
            return Err("Maximum number of players rolled".to_string());
        }

        // each player is only allowed to roll once
        if self.scores.contains_key(&ctx.sender()) {
            return Err("Repeat rolls not allowed!".to_string());
        }

        let score = rand::thread_rng().gen_range(1, 7);
        if score > self.max_score {
            self.max_score = score;
        }

        self.scores.insert(ctx.sender(), score);
        Ok(score)
    }

    /// returns a vector of players with the highest dice roll
    pub fn winner(&self, _ctx: &Context) -> Result<Vec<Address>> {
        Ok(self
            .scores
            .clone()
            .into_iter()
            .filter(|&(_, v)| v == self.max_score)
            .map(|(k, _)| k)
            .collect())
    }
}

fn main() {
    oasis_std::service!(DiceGame);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;

    /// Creates a new account and a `Context` with the new account as the sender.
    fn create_account() -> (Address, Context) {
        let addr = oasis_test::create_account(0 /* initial balance */);
        let ctx = Context::default().with_sender(addr).with_gas(100_000);
        (addr, ctx)
    }

    #[test]
    fn test() {
        // Instantiation
        let (_admin, admin_ctx) = create_account();

        let (player_one, player_one_ctx) = create_account();
        let (player_two, player_two_ctx) = create_account();
        let (player_three, player_three_ctx) = create_account();
        let (_, player_four_ctx) = create_account();
        let num_players = 3;

        let mut game = DiceGame::new(&admin_ctx, num_players);

        assert_eq!(game.num_players(&admin_ctx), num_players);
        assert_eq!(game.is_in_play(&admin_ctx), true);

        let player_one_score = game.roll(&player_one_ctx).unwrap();

        // players can only roll once
        assert!(game.roll(&player_one_ctx).is_err());

        // winner is player_one (the only player that rolled so far)
        assert_eq!(game.winner(&admin_ctx).unwrap(), vec![player_one]);

        // let winner = game.winner(&admin_ctx).unwrap();

        let player_two_score = game.roll(&player_two_ctx).unwrap();
        let two_player_max = game.max_score(&admin_ctx);

        let two_player_winner;
        // checks that scores successfully updated after 2 rolls
        if player_two_score > player_one_score {
            assert_eq!(two_player_max, player_two_score);
            two_player_winner = vec![player_two];
        } else if player_two_score < player_one_score {
            assert_eq!(two_player_max, player_one_score);
            two_player_winner = vec![player_one];
        } else {
            two_player_winner = vec![player_one, player_two];
        }

        // checks that winners are successfully updated
        assert_eq!(game.winner(&admin_ctx).unwrap(), two_player_winner);

        let player_three_score = game.roll(&player_three_ctx).unwrap();
        let final_max = game.max_score(&admin_ctx);

        let mut three_player_winner;
        // checks that scores successfully updated after 3 rolls
        if two_player_max > player_three_score {
            assert_eq!(final_max, two_player_max);
            three_player_winner = two_player_winner
        } else if two_player_max < player_three_score {
            assert_eq!(final_max, player_three_score);
            three_player_winner = vec![player_three]
        } else {
            three_player_winner = two_player_winner;
            three_player_winner.push(player_three);
        }

        // checks that winners are successfully updated
        assert_eq!(game.winner(&admin_ctx).unwrap(), three_player_winner);

        // maximum number of players have rolled
        assert_eq!(game.is_in_play(&admin_ctx), false);
        assert!(game.roll(&player_four_ctx).is_err());
    }
}
