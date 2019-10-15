use std::cmp::Ordering;

use oasis_std::{Address, Context};
use serde::{Deserialize, Serialize};


#[derive(oasis_std::Service)]
struct RockPaperScissors {
    player_name: String,
    player_move: Option<Move>,
    challenger_name: String,
    challenger_move: Option<Move>,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub enum Move {
    Rock,
    Paper,
    Scissors,
}

impl Move {
    fn compare(&self, challenger: &Self) -> Ordering {
        use Move::*;
        match (self, challenger) {
            (Rock, Scissors) | (Paper, Rock) | (Scissors, Paper) => Ordering::Greater,
            (Rock, Rock) | (Paper, Paper) | (Scissors, Scissors) => Ordering::Equal,
            (Scissors, Rock) | (Rock, Paper) | (Paper, Scissors) => Ordering::Less,
        }
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub enum Error {
    GameNotFinished,
    InvalidMove,
    AlreadyPlayed,
    AlreadyChallenged,
}

type Result<T> = std::result::Result<T, Error>;

impl RockPaperScissors {
    pub fn new(_ctx: &Context) -> Self {
        Self {
            player_name: "".to_string(),
            player_move: None,
            challenger_name: "".to_string(),
            challenger_move: None,
        }
    }

    pub fn can_play(&self, _ctx: &Context) -> bool {
        self.player_move.is_none()
    }

    pub fn can_challenge(&self, _ctx: &Context) -> bool {
        self.challenger_move.is_none()
    }

    pub fn reveal(&self, _ctx: &Context) -> Result<String> {
        if self.player_move.is_none() || self.challenger_move.is_none() {
            return Err(Error::GameNotFinished);
        }
        let p_move = self.player_move.as_ref().unwrap();
        let c_move = self.challenger_move.as_ref().unwrap();
        let result = p_move.compare(&c_move);
        match result {
            Ordering::Greater => {
                Ok(format!(
                    "{} played {:?} and {} played {:?}. {} Wins!",
                    self.player_name, p_move, self.challenger_name, c_move, self.player_name
                ))
            }
            Ordering::Equal => {
                Ok(format!(
                    "{} played {:?} and {} played {:?}. Tie!",
                    self.player_name, p_move, self.challenger_name, c_move
                ))
            }
            Ordering::Less => {
                Ok(format!(
                    "{} played {:?} and {} played {:?}. {} Wins!",
                    self.player_name, p_move, self.challenger_name, c_move, self.challenger_name
                ))
            }
        }
    }

    pub fn play(&mut self, _ctx: &Context, p_name: String, p_move: Option<Move>) -> Result<String> {
        if p_move.is_none() {
            return Err(Error::InvalidMove);
        }
        if self.player_move.is_some() {
            return Err(Error::AlreadyPlayed);
        }
        self.player_move = p_move;
        self.player_name = p_name;
        if self.player_move.is_some() && self.challenger_move.is_some() {
            return Ok(
                "Both players have played. Use reveal() to see what both players' moves were."
                    .to_string(),
            );
        }
        Ok(format!("Player {} has played.", self.player_name))
    }

    pub fn challenge(
        &mut self,
        _ctx: &Context,
        c_name: String,
        c_move: Option<Move>,
    ) -> Result<String> {
        if c_move.is_none() {
            return Err(Error::InvalidMove);
        }
        if self.challenger_move.is_some() {
            return Err(Error::AlreadyChallenged);
        }
        self.challenger_move = c_move;
        self.challenger_name = c_name;
        if self.player_move.is_some() && self.challenger_move.is_some() {
            return Ok(
                "Both players have played. Use reveal() to see what both players' moves were."
                    .to_string(),
            );
        }
        Ok(format!("Player {} has played.", self.challenger_name))
    }
}

fn main() {
    oasis_std::service!(RockPaperScissors);
}

#[cfg(test)]
mod tests {
    extern crate oasis_test;

    use super::*;

    fn create_account() -> (Address, Context) {
        let sender = oasis_test::create_account(1);
        let ctx = Context::default().with_sender(sender);
        (sender, ctx)
    }

    #[test]
    fn functionality() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true);
        assert_eq!(game.can_challenge(&player_ctx), true);
        // player 1 plays rock
        game.play(&player_ctx, "stan".to_string(), Some(Move::Rock));
        // anyone can now challenge
        assert_eq!(game.can_play(&player_ctx), false);
        // challenger challenges, plays rock
        assert_eq!(game.can_challenge(&player_ctx), true);
        // challenger challenges, plays rock
        game.challenge(&challenger_ctx, "nick".to_string(), Some(Move::Rock));
        // nobody can challenge anymore
        assert_eq!(game.can_challenge(&player_ctx), false);
        assert_eq!(
            game.reveal(&player_ctx).unwrap(),
            "stan played Rock and nick played Rock. Tie!"
        );
    }

    #[test]
    fn repeats() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        assert_eq!(game.can_play(&player_ctx), true); // they can play in any order
        assert!(game.reveal(&player_ctx).is_err());

        // stan plays first, plays rock
        game.play(&player_ctx, "stan".to_string(), Some(Move::Paper));
        // you can't play again
        assert!(game
            .play(&player_ctx, "mal".to_string(), Some(Move::Scissors))
            .is_err());

        // challenger challenges, plays rock
        game.challenge(&challenger_ctx, "nick".to_string(), Some(Move::Paper));
        // you can't challenge again
        assert!(game
            .challenge(&challenger_ctx, "mal".to_string(), Some(Move::Scissors))
            .is_err());
        // nobody can challenge anymore
        assert_eq!(game.can_play(&player_ctx), false);
    }

    #[test]
    fn bad_moves() {
        let (_player, player_ctx) = create_account();
        let (_challenger, challenger_ctx) = create_account();
        let mut game = RockPaperScissors::new(&player_ctx);

        // you can't play an invalid move
        assert!(game.play(&player_ctx, "mal".to_string(), None).is_err());
        // you can't challenge an invalid move
        assert!(game
            .challenge(&challenger_ctx, "mal".to_string(), None)
            .is_err());
    }
}
