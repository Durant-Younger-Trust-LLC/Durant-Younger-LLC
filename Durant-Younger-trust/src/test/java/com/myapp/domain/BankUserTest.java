package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class BankUserTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BankUser.class);
        BankUser bankUser1 = new BankUser();
        bankUser1.setId(1L);
        BankUser bankUser2 = new BankUser();
        bankUser2.setId(bankUser1.getId());
        assertThat(bankUser1).isEqualTo(bankUser2);
        bankUser2.setId(2L);
        assertThat(bankUser1).isNotEqualTo(bankUser2);
        bankUser1.setId(null);
        assertThat(bankUser1).isNotEqualTo(bankUser2);
    }
}
